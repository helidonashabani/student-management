-- Fixed student_add_update stored procedure
-- This version only updates fields that are provided (non-NULL)

DROP FUNCTION IF EXISTS student_add_update(JSONB);
CREATE OR REPLACE FUNCTION public.student_add_update(data jsonb)
RETURNS TABLE("userId" INTEGER, status boolean, message TEXT, description TEXT) 
LANGUAGE 'plpgsql'
AS $BODY$

DECLARE
    _operationType VARCHAR(10);
    _reporterId INTEGER;

    _userId INTEGER;
    _name TEXT;
    _roleId INTEGER;
    _gender TEXT;
    _phone TEXT;
    _email TEXT;
    _dob DATE;
    _currentAddress TEXT;
    _permanentAddress TEXT;
    _fatherName TEXT;
    _fatherPhone TEXT;
    _motherName TEXT;
    _motherPhone TEXT;
    _guardianName TEXT;
    _guardianPhone TEXT;
    _relationOfGuardian TEXT;
    _systemAccess BOOLEAN;
    _className TEXT;
    _sectionName TEXT;
    _admissionDt DATE;
    _roll INTEGER;
    
    _existingUser RECORD;
BEGIN
    _roleId = 3;
    _userId := COALESCE((data ->>'userId')::INTEGER, NULL);
    _name := data->>'name';
    _gender := data->>'gender';
    _phone := data->>'phone';
    _email := data->>'email';
    _dob := (data->>'dob')::DATE;
    _currentAddress := data->>'currentAddress';
    _permanentAddress := data->>'permanentAddress';
    _fatherName := data->>'fatherName';
    _fatherPhone := data->>'fatherPhone';
    _motherName := data->>'motherName';
    _motherPhone := data->>'motherPhone';
    _guardianName := data->>'guardianName';
    _guardianPhone := data->>'guardianPhone';
    _relationOfGuardian := data->>'relationOfGuardian';
    _systemAccess := (data->>'systemAccess')::BOOLEAN;
    _className := data->>'class';
    _sectionName := data->>'section';
    _admissionDt := (data->>'admissionDate')::DATE;
    _roll := (data->>'roll')::INTEGER;

    IF _userId IS NULL THEN
        _operationType := 'add';
    ELSE
        _operationType := 'update';
    END IF;

    -- Get reporter ID from class teacher or default to admin
    SELECT teacher_id
    FROM class_teachers
    WHERE class_name = _className AND section_name = _sectionName
    INTO _reporterId;

    IF _reporterId IS NULL THEN
        SELECT id FROM users WHERE role_id = 1 ORDER BY id ASC LIMIT 1 INTO _reporterId;
    END IF;

    -- ADD NEW STUDENT
    IF _userId IS NULL OR NOT EXISTS(SELECT 1 FROM users WHERE id = _userId) THEN
        -- Check if email already exists
        IF _email IS NOT NULL AND EXISTS(SELECT 1 FROM users WHERE email = _email) THEN
            RETURN QUERY
                SELECT NULL::INTEGER, false, 'Email already exists', NULL::TEXT;
            RETURN;
        END IF;

        -- Insert new user
        INSERT INTO users (name, email, role_id, created_dt, reporter_id)
        VALUES (_name, _email, _roleId, now(), _reporterId) 
        RETURNING id INTO _userId;

        -- Insert user profile
        INSERT INTO user_profiles
        (user_id, gender, phone, dob, admission_dt, class_name, section_name, roll, 
         current_address, permanent_address, father_name, father_phone, mother_name, 
         mother_phone, guardian_name, guardian_phone, relation_of_guardian)
        VALUES
        (_userId, _gender, _phone, _dob, _admissionDt, _className, _sectionName, _roll,
         _currentAddress, _permanentAddress, _fatherName, _fatherPhone, _motherName, 
         _motherPhone, _guardianName, _guardianPhone, _relationOfGuardian);

        RETURN QUERY
            SELECT _userId, true, 'Student added successfully', NULL::TEXT;
        RETURN;
    END IF;

    -- UPDATE EXISTING STUDENT
    -- Only update fields that are provided (not NULL)
    
    -- Check if email is being changed and if it already exists
    IF _email IS NOT NULL THEN
        SELECT email INTO _existingUser FROM users WHERE id = _userId;
        IF _email != _existingUser.email AND EXISTS(SELECT 1 FROM users WHERE email = _email AND id != _userId) THEN
            RETURN QUERY
                SELECT _userId, false, 'Email already exists', NULL::TEXT;
            RETURN;
        END IF;
    END IF;

    -- Update users table (only non-NULL fields)
    UPDATE users
    SET
        name = COALESCE(_name, name),
        email = COALESCE(_email, email),
        is_active = COALESCE(_systemAccess, is_active),
        updated_dt = now()
    WHERE id = _userId;

    -- Update user_profiles table (only non-NULL fields)
    UPDATE user_profiles
    SET
        gender = COALESCE(_gender, gender),
        phone = COALESCE(_phone, phone),
        dob = COALESCE(_dob, dob),
        admission_dt = COALESCE(_admissionDt, admission_dt),
        class_name = COALESCE(_className, class_name),
        section_name = COALESCE(_sectionName, section_name),
        roll = COALESCE(_roll, roll),
        current_address = COALESCE(_currentAddress, current_address),
        permanent_address = COALESCE(_permanentAddress, permanent_address), 
        father_name = COALESCE(_fatherName, father_name),
        father_phone = COALESCE(_fatherPhone, father_phone),
        mother_name = COALESCE(_motherName, mother_name),
        mother_phone = COALESCE(_motherPhone, mother_phone),
        guardian_name = COALESCE(_guardianName, guardian_name),
        guardian_phone = COALESCE(_guardianPhone, guardian_phone),
        relation_of_guardian = COALESCE(_relationOfGuardian, relation_of_guardian)
    WHERE user_id = _userId;

    RETURN QUERY
        SELECT _userId, true, 'Student updated successfully', NULL::TEXT;
        
EXCEPTION
    WHEN OTHERS THEN
        RETURN QUERY
            SELECT _userId::INTEGER, false, 'Unable to ' || _operationType || ' student', SQLERRM;
END;
$BODY$;

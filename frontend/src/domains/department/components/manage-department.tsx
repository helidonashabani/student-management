import * as React from 'react';
import { Box, Paper, TextField, Typography } from '@mui/material';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';

import { getErrorMsg } from '@/utils/helpers/get-error-message';
import { paymentForm } from '../types';
import { useAddNewpaymentMutation, useUpdatepaymentMutation } from '../api';

type ManagepaymentProps = {
  id?: number;
  operation: 'Add' | 'Edit';
  methods: UseFormReturn<paymentForm>;
};

export const Managepayment: React.FC<ManagepaymentProps> = ({ id, operation, methods }) => {
  const [addNewpayment, { isLoading: isAddingpayment }] = useAddNewpaymentMutation();
  const [updatepayment, { isLoading: isUpdatingpayment }] = useUpdatepaymentMutation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = methods;

  const handleSave = async (data: paymentForm) => {
    try {
      const { name } = data;
      const result =
        operation === 'Add'
          ? await addNewpayment({ name }).unwrap()
          : await updatepayment({ id: id!, name }).unwrap();

      reset();
      toast.info(result?.message);
      navigate('/app/payments');
    } catch (error) {
      toast.error(getErrorMsg(error as FetchBaseQueryError | SerializedError).message);
    }
  };

  return (
    <Box component={Paper} sx={{ p: 2 }}>
      <Typography variant='subtitle1' sx={{ mb: 3 }}>
        {' '}
        {operation} payment{' '}
      </Typography>
      <form onSubmit={handleSubmit(handleSave)}>
        <TextField
          {...register('name')}
          label='payment Name'
          fullWidth
          focused
          size='small'
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <Box textAlign='center'>
          <LoadingButton
            type='submit'
            size='small'
            variant='contained'
            sx={{ mt: 4 }}
            loading={isAddingpayment || isUpdatingpayment}
          >
            Save
          </LoadingButton>
        </Box>
      </form>
    </Box>
  );
};

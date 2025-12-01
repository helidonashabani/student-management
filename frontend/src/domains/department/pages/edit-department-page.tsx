import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Grid2 } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { getErrorMsg } from '@/utils/helpers/get-error-message';
import { Managepayment } from '../components';
import { useGetpaymentQuery } from '../api';
import { paymentForm, paymentSchema } from '../types';

export const EditpaymentPage = () => {
  const { id } = useParams();
  const { data: paymentDetail, isLoading, isError, error } = useGetpaymentQuery(Number(id));

  const methods = useForm<paymentForm>({
    defaultValues: { name: '' },
    resolver: zodResolver(paymentSchema)
  });

  React.useEffect(() => {
    if (paymentDetail) {
      const { name } = paymentDetail;
      methods.setValue('name', name);
    }
  }, [paymentDetail, methods]);

  let content: React.ReactNode | null = null;
  if (isLoading) {
    content = <>loading...</>;
  } else if (isError) {
    content = <>{getErrorMsg(error)}</>;
  } else if (!paymentDetail) {
    content = <>Record not found</>;
  } else {
    content = <Managepayment operation='Edit' id={Number(id)} methods={methods} />;
  }

  return (
    <Grid2 container>
      <Grid2 size={{ xs: 12, md: 4 }}>{content}</Grid2>
    </Grid2>
  );
};

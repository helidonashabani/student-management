import { Grid2 } from '@mui/material';
import { Info } from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { PageContentHeader } from '@/components/page-content-header';
import { paymentForm, paymentSchema } from '../../types';
import { Managepayment } from '../../components';
import { paymentData } from './payment-data';

export const ListpaymentsPage = () => {
  const methods = useForm<paymentForm>({
    defaultValues: { name: '' },
    resolver: zodResolver(paymentSchema)
  });

  return (
    <>
      <PageContentHeader icon={<Info sx={{ mr: 1 }} />} heading='payment Information' />
      <Grid2 container columnSpacing={5} rowSpacing={2}>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Managepayment operation='Add' methods={methods} />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 8 }}>
          <paymentData />
        </Grid2>
      </Grid2>
    </>
  );
};

import * as React from 'react';
import { Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

import { getErrorMsg } from '@/utils/helpers/get-error-message';
import { DialogModal } from '@/components/dialog-modal';
import { useDeletepaymentMutation } from '../../api';

type DeletepaymentProps = {
  closeModal: () => void;
  paymentId: number;
};
export const Deletepayment: React.FC<DeletepaymentProps> = ({ paymentId, closeModal }) => {
  const [deletepayment, { isLoading: isDeletingpayment }] = useDeletepaymentMutation();

  const onSave = async () => {
    try {
      const result = await deletepayment(paymentId).unwrap();
      toast.info(result.message);
      closeModal();
    } catch (error) {
      toast.error(getErrorMsg(error as FetchBaseQueryError | SerializedError).message);
    }
  };

  return (
    <DialogModal
      isSaving={isDeletingpayment}
      actionFooterCancelText='No'
      actionFooterSaveText='Yes'
      isOpen={true}
      closeModal={closeModal}
      handleSave={onSave}
      titleText='Delete payment'
    >
      <Typography variant='body1'>Are you sure you want to delete this payment?</Typography>
    </DialogModal>
  );
};

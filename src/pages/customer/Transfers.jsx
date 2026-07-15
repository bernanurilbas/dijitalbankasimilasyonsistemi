import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccounts } from '../../store/slices/accountSlice';
import { sendTransfer, resetTransferState } from '../../store/slices/transferSlice';
import PageHeader from '../../components/layout/PageHeader';
import TransferForm from '../../components/transfers/TransferForm';
import TransferSummary from '../../components/transfers/TransferSummary';
import TransferSuccess from '../../components/transfers/TransferSuccess';
import InfoCard from '../../components/cards/InfoCard';

const Transfers = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { accounts } = useSelector((state) => state.accounts);
  const { loading, error, successData } = useSelector((state) => state.transfer);

  const [step, setStep] = useState(1); // 1: Form, 2: Summary, 3: Success
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAccounts(user.id));
    }
    return () => {
      dispatch(resetTransferState());
    };
  }, [dispatch, user]);

  const handleFormSubmit = (data) => {
    setFormData(data);
    setStep(2);
  };

  const handleConfirmTransfer = async ({ type, fee }) => {
    try {
      await dispatch(sendTransfer({
        userId: user.id,
        senderAccountId: formData.senderAccountId,
        recipientIban: formData.recipientIban,
        recipientName: formData.recipientName,
        amount: formData.amount,
        type,
        description: formData.description
      })).unwrap();

      setStep(3);
    } catch (err) {
      // Error is handled in Redux slice state
    }
  };

  const handleCancelSummary = () => {
    setStep(1);
  };

  const handleNewTransfer = () => {
    dispatch(resetTransferState());
    setFormData(null);
    setStep(1);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      
      {/* Header (Hidden during official receipt printing) */}
      <div className="no-print">
        <PageHeader 
          title="Para Transferi" 
          description="EFT, FAST ve Havale işlemlerinizi 7/24 hızlı ve güvenli bir şekilde gerçekleştirebilirsiniz."
        />
      </div>

      {/* Global Error Banner */}
      {error && step === 2 && (
        <div className="no-print">
          <InfoCard
            title="İşlem Hatası"
            text={error}
            type="danger"
          />
        </div>
      )}

      {/* Step Renderers */}
      <div className="w-full">
        {step === 1 && (
          <div className="glass-panel p-8 rounded-2xl border border-brand-border">
            <TransferForm 
              accounts={accounts} 
              onSubmit={handleFormSubmit} 
            />
          </div>
        )}

        {step === 2 && formData && (
          <TransferSummary
            data={formData}
            accounts={accounts}
            onConfirm={handleConfirmTransfer}
            onCancel={handleCancelSummary}
            loading={loading}
          />
        )}

        {step === 3 && successData && (
          <TransferSuccess
            receipt={successData}
            onNewTransfer={handleNewTransfer}
          />
        )}
      </div>

    </div>
  );
};

export default Transfers;

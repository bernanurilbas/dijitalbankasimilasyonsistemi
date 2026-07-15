import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PasswordInput from '../auth/PasswordInput';
import Button from '../ui/Button';

const schema = yup.object().shape({
  currentPassword: yup.string()
    .required('Mevcut şifreniz zorunludur.'),
  newPassword: yup.string()
    .required('Yeni şifre zorunludur.')
    .min(6, 'Yeni şifre en az 6 karakter olmalıdır.'),
  newPasswordConfirm: yup.string()
    .required('Şifre onayı zorunludur.')
    .oneOf([yup.ref('newPassword')], 'Şifreler uyuşmuyor.'),
});

const PasswordForm = ({ 
  onSubmit, 
  loading 
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    }
  });

  const handleLocalSubmit = async (data) => {
    await onSubmit(data);
    reset(); // Reset form on success
  };

  return (
    <form onSubmit={handleSubmit(handleLocalSubmit)} className="flex flex-col gap-4 text-left">
      <h3 className="text-sm font-extrabold text-brand-textPrimary tracking-wide uppercase mb-1">
        Giriş Şifresini Değiştir
      </h3>

      <PasswordInput
        label="Mevcut Şifre"
        id="currentPassword"
        error={errors.currentPassword?.message}
        {...register('currentPassword')}
      />

      <PasswordInput
        label="Yeni Şifre"
        id="newPassword"
        error={errors.newPassword?.message}
        {...register('newPassword')}
      />

      <PasswordInput
        label="Yeni Şifre Tekrar"
        id="newPasswordConfirm"
        error={errors.newPasswordConfirm?.message}
        {...register('newPasswordConfirm')}
      />

      <Button 
        type="submit" 
        variant="primary" 
        loading={loading}
        className="mt-2 w-full py-2.5"
      >
        Şifreyi Güncelle
      </Button>
    </form>
  );
};

export default PasswordForm;

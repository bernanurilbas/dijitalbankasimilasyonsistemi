import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { User, Mail, Phone } from 'lucide-react';

const schema = yup.object().shape({
  fullName: yup.string()
    .required('Ad Soyad zorunludur.')
    .min(3, 'En az 3 karakter girilmelidir.'),
  email: yup.string()
    .required('E-Posta adresi zorunludur.')
    .email('Geçerli bir e-posta adresi girin.'),
  phoneNumber: yup.string()
    .required('Telefon numarası zorunludur.')
    .matches(/^[0-9\s+-]{10,15}$/, 'Geçerli bir telefon numarası girin.'),
});

const ProfileForm = ({ 
  user, 
  onSubmit, 
  loading 
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || user?.phone || '',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 text-left">
      <h3 className="text-sm font-extrabold text-brand-textPrimary tracking-wide uppercase mb-1">
        Kişisel Bilgileri Düzenle
      </h3>

      <Input
        label="Ad Soyad"
        id="fullName"
        placeholder="Adınız ve Soyadınız"
        icon={User}
        error={errors.fullName?.message}
        {...register('fullName')}
      />

      <Input
        label="E-Posta Adresi"
        id="email"
        type="email"
        placeholder="ornek@domain.com"
        icon={Mail}
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Telefon Numarası"
        id="phoneNumber"
        placeholder="05xxxxxxxxx"
        icon={Phone}
        error={errors.phoneNumber?.message}
        {...register('phoneNumber')}
      />

      <Button 
        type="submit" 
        variant="primary" 
        loading={loading}
        className="mt-2 w-full py-2.5"
      >
        Değişiklikleri Kaydet
      </Button>
    </form>
  );
};

export default ProfileForm;

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import Input from '../ui/Input';
import PasswordInput from './PasswordInput';
import Button from '../ui/Button';

// Validation Schema
const schema = yup.object().shape({
  fullName: yup.string()
    .required('Ad Soyad alanı zorunludur.')
    .min(3, 'En az 3 karakter girilmelidir.'),
  email: yup.string()
    .required('E-posta alanı zorunludur.')
    .email('Geçersiz e-posta formatı.'),
  username: yup.string()
    .required('Kullanıcı adı zorunludur.')
    .min(3, 'En az 3 karakter olmalıdır.'),
  password: yup.string()
    .required('Şifre zorunludur.')
    .min(6, 'Şifre en az 6 karakter olmalıdır.'),
  phoneNumber: yup.string()
    .required('Telefon numarası zorunludur.')
    .min(10, 'Telefon numarası en az 10 karakter olmalıdır.'),
  address: yup.string()
    .required('Adres alanı zorunludur.')
    .min(5, 'Adres en az 5 karakter olmalıdır.'),
});

const RegisterForm = ({ onSubmit, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      username: '',
      password: '',
      phoneNumber: '',
      address: '',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Full Name */}
        <Input
          label="Ad Soyad"
          id="fullName"
          placeholder="Ahmet Yılmaz"
          icon={User}
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        {/* Email */}
        <Input
          label="E-Posta Adresi"
          id="email"
          type="email"
          placeholder="ahmet@email.com"
          icon={Mail}
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Username */}
        <Input
          label="Kullanıcı Adı"
          id="username"
          placeholder="ahmetyilmaz"
          icon={User}
          error={errors.username?.message}
          {...register('username')}
        />

        {/* Password */}
        <PasswordInput
          label="Şifre"
          id="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        {/* Phone */}
        <Input
          label="Telefon Numarası"
          id="phoneNumber"
          placeholder="0555 123 45 67"
          icon={Phone}
          error={errors.phoneNumber?.message}
          {...register('phoneNumber')}
        />

        {/* Address */}
        <Input
          label="İkamet Adresi"
          id="address"
          placeholder="Kadıköy, İstanbul"
          icon={MapPin}
          error={errors.address?.message}
          {...register('address')}
        />

      </div>

      <Button 
        type="submit" 
        variant="primary" 
        loading={loading}
        className="w-full mt-4 py-3"
      >
        Hemen Kaydol
      </Button>

    </form>
  );
};

export default RegisterForm;

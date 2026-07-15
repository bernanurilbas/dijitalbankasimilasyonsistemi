import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User } from 'lucide-react';
import Input from '../ui/Input';
import PasswordInput from './PasswordInput';
import RememberMe from './RememberMe';
import ForgotPassword from './ForgotPassword';
import Button from '../ui/Button';

// Validation Schema
const schema = yup.object().shape({
  username: yup.string()
    .required('Kullanıcı adı zorunludur.')
    .min(3, 'Kullanıcı adı en az 3 karakter olmalıdır.'),
  password: yup.string()
    .required('Şifre zorunludur.')
    .min(4, 'Şifre en az 4 karakter olmalıdır.'),
  rememberMe: yup.boolean(),
});

const LoginForm = ({ onSubmit, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    }
  });

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4 text-left">
      
      {/* Username Input */}
      <Input
        label="Kullanıcı Adı"
        id="username"
        placeholder="Kullanıcı adınızı girin"
        icon={User}
        error={errors.username?.message}
        {...register('username')}
      />

      {/* Password Input */}
      <PasswordInput
        label="Şifre"
        id="password"
        placeholder="Şifrenizi girin"
        error={errors.password?.message}
        {...register('password')}
      />

      {/* Remember Me & Forgot Password wrapper */}
      <div className="flex justify-between items-center mt-1">
        <RememberMe {...register('rememberMe')} />
        <ForgotPassword />
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        variant="primary" 
        loading={loading}
        className="w-full mt-4 py-3"
      >
        Giriş Yap
      </Button>

    </form>
  );
};

export default LoginForm;

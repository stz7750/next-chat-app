'use client';

import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import Input from '@/components/inputs/Input';
import AuthSocialButton from './AuthSocialButton';
import Button from '@/components/Button';
import { toast } from 'react-hot-toast';

type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {
	const session = useSession();
	const router = useRouter();
	const [variant, setVariant] = useState<Variant>('LOGIN');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (session?.status === 'authenticated') {
			router.push('/conversations');
		}
	}, [session?.status, router]);

	const toggleVariant = useCallback(() => {
		if (variant === 'LOGIN') {
			setVariant('REGISTER');
		} else {
			setVariant('LOGIN');
		}
	}, [variant]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
	});

	const onSubmit: SubmitHandler<FieldValues> = data => {
		setIsLoading(true);

		if (variant === 'REGISTER') {
			axios
				.post('/api/register', data)
				.then(() =>
					signIn('credentials', {
						...data,
						redirect: false,
					})
				)
				.then(callback => {
					if (callback?.error) {
						toast.error('Invalid credentials!');
					}

					if (callback?.ok) {
						router.push('/conversations');
					}
				})
				.catch(() => toast.error('Something went wrong!'))
				.finally(() => setIsLoading(false));
		}

		if (variant === 'LOGIN') {
			signIn('credentials', {
				...data,
				redirect: false,
			})
				.then(callback => {
					if (callback?.error) {
						toast.error('Invalid credentials!');
					}

					if (callback?.ok) {
						router.push('/conversations');
					}
				})
				.finally(() => setIsLoading(false));
		}
	};

	const socialAction = (action: string) => {
		setIsLoading(true);

		signIn(action, { redirect: false })
			.then(callback => {
				if (callback?.error) {
					toast.error('Invalid credentials!');
				}

				if (callback?.ok) {
					router.push('/conversations');
				}
			})
			.finally(() => setIsLoading(false));
	};

	return (
		<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
			<div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
				<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
					{variant === 'REGISTER' && (
						<Input
							disabled={isLoading}
							register={register}
							errors={errors}
							required
							id="name"
							label="이름"
						/>
					)}
					<Input
						disabled={isLoading}
						register={register}
						errors={errors}
						required
						id="email"
						label="이메일"
						type="email"
					/>
					<Input
						disabled={isLoading}
						register={register}
						errors={errors}
						required
						id="password"
						label="비밀번호"
						type="password"
					/>
					<div>
						<Button disabled={isLoading} fullWidth type="submit">
							{variant === 'LOGIN' ? '로그인' : '회원가입'}
						</Button>
					</div>
				</form>

				<div className="mt-6">
					<div className="relative">
						<div className="absolute inset-0 flex items-center ">
							<div className="w-full border-t border-gray-300" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 text-gray-500 bg-white">
								소셜 로그인
							</span>
						</div>
					</div>

					<div className="flex gap-2 mt-6">
						<AuthSocialButton
							icon={BsGithub}
							onClick={() => socialAction('github')}
						/>
						<AuthSocialButton
							icon={BsGoogle}
							onClick={() => socialAction('google')}
						/>
					</div>
				</div>
				<div className="flex justify-center gap-2 px-2 mt-6 text-sm text-gray-500 ">
					<div>
						{variant === 'LOGIN'
							? '메신저를 처음 사용하시나요?'
							: '이미 계정이 있나요?'}
					</div>
					<div
						onClick={toggleVariant}
						className="underline cursor-pointer"
					>
						{variant === 'LOGIN' ? '계정 만들기' : '로그인하기'}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AuthForm;

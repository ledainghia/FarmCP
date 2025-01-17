'use client';
import DashCodeLogo from '@/components/dascode-logo';
import Copyright from '@/components/partials/auth/copyright';
import LoginForm from '@/components/partials/auth/login-form';

import { isAccessTokenValid } from '@/utils/isLogin';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { use, useEffect } from 'react';
const Login = ({ params: { locale } }: { params: { locale: string } }) => {
  useEffect(() => {
    if (isAccessTokenValid()) {
      redirect('/dashboard/analytics');
    } else {
      console.log('Token is invalid');
    }
  }, []);

  return (
    <>
      <div className='flex w-full items-center overflow-hidden min-h-dvh h-dvh basis-full'>
        <div className='overflow-y-auto flex flex-wrap w-full h-dvh'>
          <div
            className='lg:block hidden flex-1 overflow-hidden text-[35px] leading-[48px] text-default-600 
 relative z-[1] bg-default-50'
          >
            <div className='max-w-[468px] pt-20 ps-20 '>
              <Link href='/' className='mb-6 inline-block'>
                <DashCodeLogo className='!h-28 !-28'></DashCodeLogo>
              </Link>
              <h4>
                Smart Farminggg
                <br />
                <span className='text-default-800 font-bold ms-2'>
                  Smarter Future!
                </span>
              </h4>
            </div>
            <div className='absolute left-0 2xl:bottom-[-160px] bottom-[-300px] h-full w-full z-[-1]'>
              <Image
                src='/images/auth/ils1.svg'
                alt=''
                width={300}
                height={350}
                className='w-full h-full'
              />
            </div>
          </div>
          <div className='flex-1 relative'>
            <div className=' h-full flex flex-col  dark:bg-default-100 bg-white'>
              <div className='max-w-[524px] md:px-[42px] md:py-[44px] p-7  mx-auto w-full text-2xl text-default-900  mb-3 h-full flex flex-col justify-center'>
                <div className='flex justify-center items-center text-center mb-6 lg:hidden '>
                  <Link href='/'>
                    <DashCodeLogo></DashCodeLogo>
                  </Link>
                </div>
                <div className='text-center 2xl:mb-10 mb-4'>
                  <h4 className='font-medium'>Đăng nhập</h4>
                  <div className='text-default-500 text-base'>
                    Chào mừng bạn đến với{' '}
                    <span className='!font-bold'>Nông Dân Online</span>
                  </div>
                </div>
                <LoginForm />
                {/* <div className='relative border-b-[#9AA2AF] border-opacity-[16%] border-b pt-6'>
                  <div className='absolute inline-block bg-default-50 dark:bg-default-100 left-1/2 top-1/2 transform -translate-x-1/2 px-4 min-w-max text-sm text-default-500 font-normal'>
                    Or continue with
                  </div>
                </div>
                <div className='max-w-[242px] mx-auto mt-8 w-full'>
                  <Social locale={locale} />
                </div> */}
              </div>
              <div className='text-xs font-normal text-default-500  z-[999] pb-10 text-center'>
                <Copyright />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

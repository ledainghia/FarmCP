'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import AddMedication from '@/app/(protected)/app/bac_si/benh_tat/components/addMedication';
import DiagnosisMedication from '@/app/(protected)/app/bac_si/benh_tat/components/diagnosisMedication';
import StepsProgress from '@/app/(protected)/app/bac_si/benh_tat/components/stepsProgress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { docterApi } from '@/config/api';
import { MedicalSymptomDTO, PrescriptionsDTO } from '@/dtos/MedicalSymptomDTO';
import {
  MedicationFormDTO,
  StandardprescriptionDTO,
} from '@/dtos/MedicationDTO';
import { useCagesQuery, useMedicationQuery } from '@/hooks/use-query';
import { swalMixin } from '@/utils/swalMixin';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lightgallery.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import LightGallery from 'lightgallery/react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Icon } from '../ui/icon';
import { Input } from '../ui/input';
import { InputNumber } from '../ui/input-number';
import { Textarea } from '../ui/textarea';
import { formSchema as formSchema2 } from '@/app/(protected)/app/bac_si/benh_tat/components/addPrescription';

const formSchema = z
  .object({
    isSeperatorCage: z.boolean().optional(),
    cageId: z.string().optional(),
    notes: z.string().optional(),
    daysToTake: z.number().min(1),
    quantityAnimal: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isSeperatorCage) {
      if (!data.cageId || data.cageId === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['cageId'],
          message: 'Vui lòng chọn chuồng',
        });
      }
    }
  });

function MedicalSymptomCard({
  medicalSymptomsData,
}: {
  medicalSymptomsData: MedicalSymptomDTO;
}) {
  const clientQuery = useQueryClient();

  const [open, setOpen] = useState<boolean>(false);
  const [stepCurrent, setStepCurrent] = useState<number>(1);

  const [isSeperatorCage, setIsSeperatorCage] = useState<boolean>(false);

  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const addMedicationRef = useRef<{
    submitAll: () => void;
    getValidValues: () => [];
    getNumberOfForms: () => number[];
    handleSetDefaultValues: (values: MedicationFormDTO[]) => void;
  }>(null);
  const addMedicationSCRef = useRef<{
    submitAll: () => void;
    getValidValues: () => [];
  }>(null);

  const diagnosisFormRef = useRef<{
    submitForm: () => void;
    getValidValue: () => {
      diagnosis: string;
      notes: string;
    };
  }>(null);

  const [numberOfMedication, setNumberOfMedication] = useState<number>(0);
  const [numberOfMedicationSC, setNumberOfMedicationSC] = useState<number>(0);
  const [standardPrescription, setStandardPrescription] =
    useState<StandardprescriptionDTO | null>(null);
  const [openDialogPrescription, setOpenDialogPrescription] =
    useState<boolean>(false);

  const [prescriptions, setPrescriptions] = useState<PrescriptionsDTO | null>(
    null
  );

  const { data: medications } = useMedicationQuery();

  const [baseDataInput, setBaseDataInput] =
    useState<z.infer<typeof formSchema>>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isSeperatorCage: false,
      notes: standardPrescription?.notes || '',
    },
  });

  useEffect(() => {
    if (standardPrescription?.notes) {
      form.setValue('notes', standardPrescription?.notes);
      toast.success('Đã tải thông tin đơn thuốc cũ');
    }
    if (standardPrescription?.medications) {
      addMedicationRef.current?.handleSetDefaultValues(
        standardPrescription?.medications
      );
      console.log('standardPrescription', standardPrescription?.medications);
    }
  }, [standardPrescription]);

  const [medicationDataOfCage, setMedicationDataOfCage] = useState<
    z.infer<typeof formSchema2>[]
  >([]);

  const createPrescription = useMutation({
    mutationFn: (data: any) => {
      return docterApi.createPrescription(data, medicalSymptomsData.id);
    },
    onSuccess() {
      toast.success('Đơn thuốc và chuẩn đoán đã được tạo thành công');

      form.reset();
      clientQuery.invalidateQueries({ queryKey: ['medicalSymptom'] });
      setOpen(false);
    },
    onError(erorr: any) {
      console.error('Lỗi khi tạo đơn thuốc! vui lòng kiểm tra lại', erorr);
      setOpen(true);
      toast.error(
        erorr.response?.data?.result?.message ||
          'Lỗi khi tạo đơn thuốc! Vui lòng kiểm tra lại'
      );
    },
  });

  const cancelMedicalSymptom = useMutation({
    mutationFn: (data: any) => {
      return docterApi.cancelMedicalSymptom(data, medicalSymptomsData.id);
    },
    onSuccess() {
      clientQuery.invalidateQueries({ queryKey: ['medicalSymptom'] });
      swalMixin.fire({
        title: 'Đã từ chối khám bệnh',
        text: 'Có vẻ đây là trường hợp vật nuôi bình thường',
        icon: 'success',
      });
    },
    onError(erorr: any) {
      toast.error(
        erorr.response?.data?.result?.message ||
          'Lỗi khi chuẩn đoán! Vui lòng kiểm tra lại'
      );
    },
  });

  const handleNext = () => {
    if (stepCurrent === 1) {
      diagnosisFormRef.current?.submitForm();
      const isValid = diagnosisFormRef.current?.getValidValue();
      if (isValid) {
        setStepCurrent(stepCurrent + 1);
      }
      return;
    } else if (stepCurrent === 2) {
      submitButtonRef.current?.click();
      return;
    } else if (stepCurrent === 3) {
      addMedicationRef.current?.submitAll();
      const numberOfValidMedication =
        addMedicationRef.current?.getValidValues().length;
      const getNumberOfForms =
        addMedicationRef.current?.getNumberOfForms().length;

      if (numberOfValidMedication === getNumberOfForms) {
        setStepCurrent(stepCurrent + 1);
      }
      return;
    } else if (stepCurrent === 4 && isSeperatorCage) {
      addMedicationSCRef.current?.submitAll();
      const numberOfValidMedication =
        addMedicationSCRef.current?.getValidValues().length;

      if (numberOfValidMedication === numberOfMedicationSC) {
        setStepCurrent(stepCurrent + 1);
      }
      return;
    } else if ((stepCurrent === 4 && !isSeperatorCage) || stepCurrent === 5) {
      const medications = medicationDataOfCage.map((medication) => {
        return {
          medicationId: medication.medicationId,
          morning: medication.check?.morning?.dosage || 0,
          noon: medication.check?.noon?.dosage || 0,
          afternoon: medication.check?.afternoon?.dosage || 0,
          evening: medication.check?.evening?.dosage || 0,
          notes: medication.note,
        };
      });

      const validValue = diagnosisFormRef.current?.getValidValue();
      const { diagnosis, notes } = validValue || {};

      const dataRequest = {
        diagnosis: diagnosis,
        notes: notes,
        status: 'Prescribed',
        createPrescriptionRequest: {
          medicalSymptomId: medicalSymptomsData.id,
          prescribedDate: new Date().toISOString(),
          notes: baseDataInput?.notes,
          daysToTake: baseDataInput?.daysToTake,
          quantityAnimal: medicalSymptomsData.affectedQuantity,
          status: 'Active',
          cageId: 'd9c0aec4-40aa-40cb-8e1d-bdf1b342f1f6',
          medications: medications,
        },
      };
      console.table(dataRequest);
      createPrescription.mutate(dataRequest);
      return;
    }

    setStepCurrent(stepCurrent + 1);
  };

  const handlePrev = () => {
    setStepCurrent(stepCurrent - 1);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setBaseDataInput(values);

      setStepCurrent(stepCurrent + 1);
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
    }
  }

  const [steps, setSteps] = useState([
    { label: 'Chuẩn đoán bệnh', index: 1 },
    { label: 'Thông tin cơ bản', index: 2 },
    { label: 'Chọn thuốc', index: 3 },
    { label: 'Kiểm tra lại đơn thuốc', index: 4 },
  ]);

  useEffect(() => {
    if (!!!isSeperatorCage) {
      setSteps([
        { label: 'Chuẩn đoán bệnh', index: 1 },
        { label: 'Thông tin cơ bản', index: 2 },
        { label: 'Chọn thuốc', index: 3 },
        { label: 'Kiểm tra lại đơn thuốc', index: 4 },
      ]);
    } else {
      setSteps([
        { label: 'Thông tin cơ bản', index: 1 },
        { label: 'Chọn thuốc cho chuồng bị bệnh', index: 2 },
        { label: 'Chọn thuốc cho chuồng cách ly', index: 3 },
        { label: 'Kiểm tra lại đơn thuốc', index: 4 },
      ]);
    }
  }, [isSeperatorCage]);

  const swal = () =>
    swalMixin
      .fire({
        title: 'Bạn có muốn khám cho trường hợp này không?',
        text: 'Hãy chắc chắn rằng bạn đã xem xét kỹ lưỡng trước khi tiếp tục',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Tiếp tục',
        cancelButtonText: 'Từ chối',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          setOpen(true);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          const dataRequest = {
            diagnosis: 'Vật nuôi bình thường',
            status: 'Rejected',
            notes: 'Có vẻ đây là trường hợp vật nuôi bình thường',
            createPrescriptionRequest: null,
          };
          cancelMedicalSymptom.mutate(dataRequest);
        }
      });

  return (
    <>
      {/* <DeleteConfirmationDialog open={open} onClose={() => setOpen(false)} /> */}
      {/* <EditTask open={editTaskOpen} setOpen={setEditTaskOpen} /> */}

      <Card
        onClick={() => {
          if (medicalSymptomsData.status === 'Pending') swal();
          else if (medicalSymptomsData.status === 'Prescribed') {
            setOpenDialogPrescription(true);
            setPrescriptions(medicalSymptomsData.prescriptions);
          }
        }}
      >
        <CardHeader className='flex-row gap-1 p-2.5 items-center space-y-0 border-b'>
          <h3 className='flex-1 text-default-800 text-lg font-medium truncate text-center  '>
            Bệnh ở {medicalSymptomsData.nameAnimal}
          </h3>
        </CardHeader>
        <CardContent className='p-2.5 pt-1'>
          <div className='flex-col gap-2 '>
            <div className=' text-default-400 mb-1'>Triệu chứng</div>
            <div className='h-20'>
              <div className='text-default-600 '>
                {medicalSymptomsData.symptoms}
              </div>
            </div>
          </div>

          <div className='flex gap-2 mt-2'>
            <div>
              <div className=' text-default-400 mb-1'>Ngày khởi tạo</div>
              <div className=' text-default-600  font-medium'>
                {new Date(medicalSymptomsData.createAt).toLocaleDateString()}
              </div>
            </div>
            <Separator
              orientation='vertical'
              className='text-default-200 h-12'
            />
            <div>
              <div className=' text-default-400 mb-1'>
                Số lượng vật nuôi ảnh hưởng
              </div>
              <div className=' text-default-600  font-medium'>
                {medicalSymptomsData.affectedQuantity} /{' '}
                {medicalSymptomsData.quantity}
              </div>
            </div>
          </div>

          <div className='flex-col gap-2 mt-2'>
            <div className=' text-default-400 mb-1'>Ghi chú</div>
            <div className='h-20'>
              {' '}
              <div className='text-default-600 '>
                {medicalSymptomsData.notes}
              </div>
            </div>
          </div>
          <div className='mt-1'></div>
          {/* <div className='flex mt-5'>
            <div className='flex-1'>
              <div className='text-default-400   font-normal mb-3'>
                Hình ảnh thực tế
              </div>
              <div
                className=''
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <LightGallery
                  speed={500}
                  plugins={[lgThumbnail, lgZoom]}
                  addClass='w-full grid grid-cols-6 gap-3'
                  elementClassNames='w-full grid grid-cols-6 gap-3'
                >
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index + 'Images'}
                      className='relative group w-full'
                      data-src='https://images.unsplash.com/photo-1523569467793-70cfeec01d58?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                    >
                      <Image
                        src='https://images.unsplash.com/photo-1523569467793-70cfeec01d58?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                        width={500}
                        height={500}
                        className='w-full rounded-lg'
                        alt='Hình ảnh vật nuôi bị bệnh'
                      />

                      <div className='absolute rounded-lg inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-300'>
                        <div className='flex flex-col justify-center items-center gap-1'>
                          <Icon
                            icon={'lets-icons:full-alt'}
                            className='h-6 w-6'
                          />
                          <span className='text-sm font-medium'>
                            Phóng to ảnh
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </LightGallery>
              </div>
            </div>
          </div> */}
        </CardContent>
      </Card>
      <Dialog
        open={open}
        key={medicalSymptomsData.id + '-dialogTask'}
        onOpenChange={(e) => {
          setOpen(e);
        }}
      >
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent
          size='lg'
          className={cn(
            stepCurrent === 2 || stepCurrent === 1 ? '!max-w-3xl' : '',
            stepCurrent === 4 ? '!max-w-4xl' : ''
          )}
        >
          <DialogHeader>
            <DialogTitle>
              Chuẩn đoán và chữa bệnh cho {medicalSymptomsData.nameAnimal}
            </DialogTitle>
            <DialogDescription>
              <span className='font-medium text-primary-600'>
                Loài:{' '}
                <span className='font-bold'>
                  {medicalSymptomsData.nameAnimal}
                </span>{' '}
                | Triệu chứng:{' '}
                <span className='font-bold'>
                  {medicalSymptomsData.symptoms}
                </span>{' '}
                {stepCurrent >= 2 && stepCurrent <= 3 ? (
                  <span>
                    <br /> Chuẩn đoán:{' '}
                    <span className='font-bold'>
                      {diagnosisFormRef.current?.getValidValue()?.diagnosis ||
                        'Chưa chuẩn đoán'}
                    </span>
                  </span>
                ) : (
                  ''
                )}
                {stepCurrent === 3 ? (
                  <span>
                    {' '}
                    | Ghi chú:{' '}
                    <span className='font-bold'>
                      {baseDataInput?.notes || 'Chưa chuẩn đoán'}
                    </span>{' '}
                    | Số ngày sử dụng thuốc:{' '}
                    <span className='font-bold'>
                      {baseDataInput?.daysToTake + ' ngày' || 'Chưa chuẩn đoán'}
                    </span>
                  </span>
                ) : (
                  ''
                )}
              </span>
              <br />
              Hãy điền đầy đủ các ô nhập phía dưới rồi bấm nút lưu để lưu lại
              thông tin
            </DialogDescription>
          </DialogHeader>

          <StepsProgress steps={steps} currentStep={stepCurrent} />

          <DiagnosisMedication
            ref={diagnosisFormRef}
            setStandardPrescription={setStandardPrescription}
            standardPrescription={standardPrescription}
            className={stepCurrent === 1 ? '' : 'hidden'}
          />
          <div className={stepCurrent === 2 ? '' : 'hidden'}>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-3  py-5'
              >
                <FormField
                  control={form.control}
                  name='notes'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Ghi chú</FormLabel>
                      <FormControl>
                        <Textarea placeholder='' {...field} />
                      </FormControl>
                      <FormDescription>Nhập ghi chú nếu có</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-12 gap-4'>
                  <div className='col-span-12'>
                    <FormField
                      control={form.control}
                      name='daysToTake'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Số ngày thuốc</FormLabel>
                          <FormControl>
                            <InputNumber {...field} />
                          </FormControl>
                          <FormDescription>
                            Nhập số ngày thuốc cho vật nuôi
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className='flex justify-end gap-2'>
                  <Button
                    ref={submitButtonRef}
                    className='hidden'
                    type='submit'
                  >
                    Tiếp tục
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          <AddMedication
            ref={addMedicationRef}
            setNumberOfMedication={setNumberOfMedication}
            numberOfMedication={numberOfMedication}
            setValues={setMedicationDataOfCage}
            className={stepCurrent === 3 ? '' : 'hidden'}
          />

          <div
            className={
              stepCurrent === 4 && !isSeperatorCage
                ? ''
                : stepCurrent === 5 && isSeperatorCage
                ? ''
                : 'hidden'
            }
          >
            <span className='flex items-center'>
              <span className='pr-3 font-bold'>Thông tin cơ bản</span>
              <span className='h-px flex-1 bg-black'></span>
            </span>

            <div className='flow-root rounded-lg border border-gray-100 py-3 shadow-sm mt-3'>
              <dl className='-my-3 divide-y divide-gray-100 text-sm'>
                <div className='grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4'>
                  <dt className='font-medium text-gray-900'>Chuẩn đoán </dt>
                  <dd className='text-gray-700 sm:col-span-2'>
                    {diagnosisFormRef.current?.getValidValue()?.diagnosis}
                  </dd>
                </div>

                <div className='grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4'>
                  <dt className='font-medium text-gray-900'>
                    Số ngày dùng thuốc{' '}
                  </dt>
                  <dd className='text-gray-700 sm:col-span-2'>
                    {baseDataInput?.daysToTake} ngày
                  </dd>
                </div>

                <div className='grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4'>
                  <dt className='font-medium text-gray-900'>Ghi chú </dt>
                  <dd className='text-gray-700 sm:col-span-2'>
                    {baseDataInput?.notes}
                  </dd>
                </div>
              </dl>
            </div>

            <span className='flex items-center mt-3'>
              <span className='pr-3 font-bold'>
                Đơn thuốc ({medicationDataOfCage.length} loại bao gồm{' '}
                {medicationDataOfCage
                  .map((item) => {
                    return medications?.items.find(
                      (medication) => medication.id === item.medicationId
                    )?.name;
                  })
                  .join(', ')}{' '}
                )
              </span>
              <span className='h-px flex-1 bg-black'></span>
            </span>
            <div
              className={cn(
                'w-full grid  gap-2 mt-2',
                isSeperatorCage ? 'grid-cols-2' : 'grid-cols-1'
              )}
            >
              <div>
                <table className='table-auto border-collapse w-full text-sm'>
                  <thead>
                    <tr>
                      <th className='border px-4 py-2 text-center  w-16 '>
                        STT
                      </th>
                      <th className='border px-4 py-2 text-left w-96'>
                        Tên thuốc - Hoạt chất
                      </th>
                      <th className='border px-4 py-2 text-left'>
                        Cách dùng - Liều lượng
                      </th>
                      {/* <th className='border px-4 py-2 text-right w-32'>
                        Liều lượng
                      </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {medicationDataOfCage.map((item, index) => (
                      <tr
                        key={index}
                        className={cn(
                          'hover:bg-gray-100',
                          (index + 1) % 2 === 0 ? 'bg-primary-200' : ''
                        )}
                      >
                        <td className='border px-4 py-2 text-center '>
                          {index + 1}
                        </td>
                        <td className='border px-4 py-2'>
                          {medications
                            ? medications.items.find(
                                (medication) =>
                                  medication.id === item.medicationId
                              )?.name
                            : 'Chưa chọn thuốc'}
                        </td>

                        <td className='border px-4 py-2 '>
                          {item.check?.morning?.checked &&
                            (item.check?.morning?.dosage ?? 0) > 0 && (
                              <span>
                                <span className='font-bold'>Buổi sáng:</span>{' '}
                                {item.check.morning.dosage} liều -{' '}
                              </span>
                            )}
                          {item.check?.noon?.checked &&
                            (item.check?.noon?.dosage ?? 0) > 0 && (
                              <span>
                                <span className='font-bold'>Buổi trưa:</span>{' '}
                                {item.check.noon.dosage} liều -{' '}
                              </span>
                            )}
                          {item.check?.afternoon?.checked &&
                            (item.check?.afternoon?.dosage ?? 0) > 0 && (
                              <span>
                                <span className='font-bold'>Buổi chiều:</span>{' '}
                                {item.check.afternoon.dosage} liều -{' '}
                              </span>
                            )}
                          {item.check?.evening?.checked &&
                            (item.check?.evening?.dosage ?? 0) > 0 && (
                              <span>
                                <span className='font-bold'>Buổi tối:</span>{' '}
                                {item.check.evening.dosage} liều -{' '}
                              </span>
                            )}
                          {item.note ? (
                            <span>
                              {' '}
                              <span className='font-bold'>
                                Ghi chú cho loại thuốc này:{' '}
                              </span>
                              {item.note}
                            </span>
                          ) : (
                            ''
                          )}
                        </td>
                        {/* <td className='border px-4 py-2 text-right'>
                          {item.dosage}
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className='flex justify-end gap-2 mt-3'>
            <Button onClick={handlePrev} disabled={stepCurrent === 1}>
              Quay lại
            </Button>
            <Button
              onClick={() => handleNext()}
              disabled={createPrescription.isPending}
            >
              {stepCurrent === 4
                ? createPrescription.isPending
                  ? 'Đang lưu đơn thuốc'
                  : 'Lưu đơn thuốc'
                : 'Tiếp tục'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDialogPrescription}
        onOpenChange={setOpenDialogPrescription}
      >
        {/* <DialogTrigger asChild>
          <Button variant='outline'>Edit Profile</Button>
        </DialogTrigger> */}
        <DialogContent size='md'>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <span className='flex items-center'>
              <span className='pr-3 font-bold'>Thông tin cơ bản</span>
              <span className='h-px flex-1 bg-black'></span>
            </span>

            <div className='flow-root rounded-lg border border-gray-100 py-3 shadow-sm mt-3'>
              <dl className='-my-3 divide-y divide-gray-100 text-sm'>
                <div className='grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4'>
                  <dt className='font-medium text-gray-900'>Chuẩn đoán </dt>
                  <dd className='text-gray-700 sm:col-span-2'>
                    {medicalSymptomsData.diagnosis}
                  </dd>
                </div>

                <div className='grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4'>
                  <dt className='font-medium text-gray-900'>
                    Số ngày dùng thuốc{' '}
                  </dt>
                  <dd className='text-gray-700 sm:col-span-2'>
                    {prescriptions?.daysToTake} ngày
                  </dd>
                </div>

                <div className='grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4'>
                  <dt className='font-medium text-gray-900'>Ghi chú </dt>
                  <dd className='text-gray-700 sm:col-span-2'>
                    {prescriptions?.notes}
                  </dd>
                </div>
              </dl>
            </div>

            <span className='flex items-center mt-3'>
              <span className='pr-3 font-bold'>
                Đơn thuốc ({prescriptions?.medications.length} loại bao gồm{' '}
                {prescriptions?.medications
                  .map((item) => {
                    return medications?.items.find(
                      (medication) => medication.id === item.medicationId
                    )?.name;
                  })
                  .join(', ')}{' '}
                )
              </span>
              <span className='h-px flex-1 bg-black'></span>
            </span>
            <div className={cn('w-full grid  gap-2 mt-2', 'grid-cols-1')}>
              <div>
                <table className='table-auto border-collapse w-full text-sm'>
                  <thead>
                    <tr>
                      <th className='border px-4 py-2 text-center  w-16 '>
                        STT
                      </th>
                      <th className='border px-4 py-2 text-center'>
                        Tên thuốc - Hoạt chất
                      </th>
                      <th className='border px-4 py-2 text-center w-96'>
                        Cách dùng
                      </th>
                      <th className='border px-4 py-2 text-center '>Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions?.medications.map((item, index) => (
                      <tr
                        key={index}
                        className={cn(
                          'hover:bg-gray-100',
                          (index + 1) % 2 === 0 ? 'bg-primary-200' : ''
                        )}
                      >
                        <td className='border px-4 py-2 text-center '>
                          {index + 1}
                        </td>
                        <td className='border px-4 py-2'>
                          {medications
                            ? medications.items.find(
                                (medication) =>
                                  medication.id === item.medicationId
                              )?.name
                            : 'Chưa chọn thuốc'}
                        </td>
                        <td className='border px-4 py-2'>
                          Sử dụng{' '}
                          {Object.values(item)
                            .filter((_, key) =>
                              [
                                'morning',
                                'afternoon',
                                'evening',
                                'noon',
                              ].includes(Object.keys(item)[key])
                            )
                            .reduce(
                              (total, value) => Number(total) + Number(value),
                              0
                            )}{' '}
                          lần mỗi ngày (
                          {['Sáng', 'Trưa', 'Chiều', 'Tối']
                            .map((session, index) => {
                              const sessionKey = [
                                'morning',
                                'afternoon',
                                'evening',
                                'noon',
                              ][index] as
                                | 'morning'
                                | 'afternoon'
                                | 'evening'
                                | 'noon';
                              const dose = item[sessionKey];
                              return dose > 0 ? `${session} x${dose}` : null;
                            })
                            .filter(Boolean)
                            .join(', ')}
                          )
                        </td>
                        <td className='border px-4 py-2 '>{item.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default MedicalSymptomCard;

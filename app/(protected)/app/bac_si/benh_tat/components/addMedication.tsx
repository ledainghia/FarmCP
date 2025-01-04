import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import React, {
  createRef,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';

import { z } from 'zod';
import AddPrescription from './addPrescription';

const formSchema2 = z.object({
  id: z.number(),
  medicationId: z.string(),
  dosage: z.number().min(0),
  sessions: z.array(z.string()).min(1, { message: 'Hãy chọn ít nhất 1 buổi' }),
});

interface Props {
  setValues: (values: z.infer<typeof formSchema2>[]) => void;
  className?: string;
  setNumberOfMedication: (value: number) => void;
  numberOfMedication: number;
}

// Các import khác giữ nguyên

const AddMedication = forwardRef(
  (
    { setValues, className, setNumberOfMedication, numberOfMedication }: Props,
    parentRef
  ) => {
    const [forms, setForms] = useState<number[]>([]); // Quản lý các form
    const refs = useRef<{
      [key: number]: React.RefObject<{ submit: () => void }>;
    }>({});

    const [formValues, setFormValues] = useState<
      { id: number; values: z.infer<typeof formSchema2> }[]
    >([]);

    const [submit, setSubmit] = useState<boolean>(false);

    // Hàm để xử lý submit tất cả form
    const handleSubmitAll = () => {
      const isValid = formValues.every((item) => {
        try {
          formSchema2.parse(item.values);
          return true;
        } catch (error) {
          return false;
        }
      });

      setSubmit(true);

      if (isValid && formValues.length > 0) {
        setValues(formValues.map((form) => form.values));
      } else {
        console.log('Có trường có giá trị null hoặc không hợp lệ');
      }
    };
    const validValuesRef = useRef<z.infer<typeof formSchema2>[]>([]);

    const getValidValues = () => {
      validValuesRef.current = formValues
        .filter((item) => {
          try {
            formSchema2.parse(item.values);
            return true;
          } catch (error) {
            return false;
          }
        })
        .map((form) => form.values);

      return validValuesRef.current;
    };

    // Expose handleSubmitAll to parent via ref
    useImperativeHandle(parentRef, () => ({
      submitAll: handleSubmitAll,
      getValidValues: getValidValues,
    }));

    const handleAddForm = () => {
      const newId = forms.length > 0 ? forms[forms.length - 1] + 1 : 0;
      setForms((prevForms) => {
        const updatedForms = [...prevForms, newId];
        setNumberOfMedication(updatedForms.length); // Cập nhật số lượng
        return updatedForms;
      });
      refs.current[newId] = createRef();
    };

    const handleRemoveForm = (id: number) => {
      setForms((prevForms) => {
        const updatedForms = prevForms.filter((formId) => formId !== id);
        setNumberOfMedication(updatedForms.length); // Cập nhật số lượng
        return updatedForms;
      });
      setFormValues((prevValues) =>
        prevValues.filter((form) => form.id !== id)
      );
      delete refs.current[id];
    };

    const handleValuesChange = (values: any, id: number) => {
      setFormValues((prevValues) => {
        const index = prevValues.findIndex((item) => item.id === id);

        if (index !== -1) {
          const prevItem = prevValues[index];
          if (JSON.stringify(prevItem.values) !== JSON.stringify(values)) {
            const updatedValues = [...prevValues];
            updatedValues[index] = { id, values };
            return updatedValues;
          }
          return prevValues;
        } else {
          return [...prevValues, { id, values }];
        }
      });
    };

    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {forms.map((id) => (
          <div key={id} className='relative border p-4 rounded-lg'>
            <button
              className='absolute top-0 right-0 text-red-500 hover:text-red-700'
              onClick={() => handleRemoveForm(id)}
            >
              <Icon icon={'typcn:delete-outline'} className='w-6 h-6'></Icon>
            </button>
            <AddPrescription
              id={id}
              value={
                formValues.find((form) => form.id === id)?.values || {
                  id,
                  medicationId: '',
                  dosage: 0,
                  sessions: [],
                }
              }
              onChange={(value) => handleValuesChange(value, id)}
              submit={submit}
              setSubmit={setSubmit}
            />
          </div>
        ))}

        <Button
          variant={'outline'}
          className='w-full mt-3'
          onClick={() => {
            setNumberOfMedication(numberOfMedication + 1);
            handleAddForm();
          }}
        >
          Thêm thuốc
        </Button>
        <div className='flex justify-end gap-2 mt-3'>
          <Button onClick={handleSubmitAll} className='hidden'>
            Tiếp tục
          </Button>
        </div>
      </div>
    );
  }
);

AddMedication.displayName = 'AddMedication';

export default AddMedication;

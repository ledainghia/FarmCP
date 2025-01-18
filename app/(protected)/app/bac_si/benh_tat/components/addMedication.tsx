import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import React, {
  createRef,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  use,
  useEffect,
} from 'react';

import { z } from 'zod';
import AddPrescription, { formSchema as formSchema2 } from './addPrescription';
import { MedicationFormDTO } from '@/dtos/MedicationDTO';
import { mapSessions } from '@/utils/mappingSession';

interface Props {
  setValues: (values: z.infer<typeof formSchema2>[]) => void;
  className?: string;
  setNumberOfMedication: (value: number) => void;
  numberOfMedication: number;
}

const AddMedication = forwardRef(
  (
    { setValues, className, setNumberOfMedication, numberOfMedication }: Props,
    parentRef
  ) => {
    const refs = useRef<{
      [key: number]: React.RefObject<{ submit: () => void }>;
    }>({});

    const [formValues, setFormValues] = useState<
      { id: number; values: z.infer<typeof formSchema2> }[]
    >([]);
    const [forms, setForms] = useState<number[]>([]);

    useEffect(() => {
      console.log('formValues', forms);
    }, [forms]);

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
            console.error('error', error);
            return false;
          }
        })
        .map((form) => form.values);

      return validValuesRef.current;
    };

    const getNumberOfForms = () => {
      return forms;
    };

    const handleAddForm = () => {
      const newId = forms.length > 0 ? forms[forms.length - 1] + 1 : 0;
      if (setForms) {
        setForms((prevForms: number[]) => {
          const updatedForms: number[] = [...prevForms, newId];
          setNumberOfMedication(updatedForms.length); // Update the count
          return updatedForms;
        });
      }
      refs.current[newId] = createRef();
      setNumberOfMedication(numberOfMedication + 1);
    };

    const handleRemoveForm = (id: number) => {
      if (setForms) {
        setForms((prevForms) => {
          const updatedForms = prevForms.filter((formId) => formId !== id);
          setNumberOfMedication(updatedForms.length); // Update the count
          return updatedForms;
        });
      }
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

    const handleSetDefaultValues = (values: MedicationFormDTO[]) => {
      console.log('values handleSetDefaultValues', values);
      const newForms = values.map((value, index) => {
        const id = index;
        refs.current[id] = createRef();

        const vl = {
          id,
          medicationId: value.medicationId,
          check: {
            morning: {
              dosage: value.morning,
              checked: value.morning > 0,
            },
            afternoon: {
              dosage: value.afternoon,
              checked: value.afternoon > 0,
            },
            evening: {
              dosage: value.evening,
              checked: value.evening > 0,
            },
            noon: { dosage: value.noon, checked: value.noon > 0 },
          },
        };
        return { id, values: vl };
      });
      console.log('newForms', newForms);
      setForms(newForms.map((form) => form.id));
      setFormValues(newForms);
    };

    // Expose handleSubmitAll to parent via ref
    useImperativeHandle(parentRef, () => ({
      submitAll: handleSubmitAll,
      getValidValues: getValidValues,
      getNumberOfForms: getNumberOfForms,
      handleSetDefaultValues: handleSetDefaultValues,
    }));

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

                  check: {
                    morning: { dosage: 0, checked: false },
                    afternoon: { dosage: 0, checked: false },
                    evening: { dosage: 0, checked: false },
                    noon: { dosage: 0, checked: false },
                  },
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

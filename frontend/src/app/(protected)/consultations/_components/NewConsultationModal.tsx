"use client";

import { useState } from "react";
import Modal from "./Modal";
import PersianDateTimePicker from "./PersianDateTimePicker";

import { X } from "lucide-react";

const today = "";

interface FormValues {
  clientName: string;
  phone: string;
  sessionDate: string;
  sessionTime: string;
  description: string;
}

interface Props {
  onClose: () => void;
  onSave: (consultation: FormValues) => void;
}

const fieldClass =
  "w-full rounded-lg border border-[#E4E1D8] bg-white px-3 py-2 text-sm outline-none focus:border-[#A9762F]";

const labelClass =
  "mb-1.5 block text-sm font-medium text-[#262420]";

const errorClass =
  "mt-1 text-sm text-[#A32D2D]";


function RequiredLabel({
  text,
}: {
  text: string;
}) {
  return (
    <label className={labelClass}>
      {text}
      <span className="text-red-600 mr-1">*</span>
    </label>
  );
}


export default function NewConsultationModal({
  onClose,
  onSave,
}: Props) {

  const [values, setValues] =
    useState<FormValues>({
      clientName: "",
      phone: "",
      sessionDate: today,
      sessionTime: "",
      description: "",
    });


  const [errors, setErrors] =
    useState<
      Partial<Record<keyof FormValues, string>>
    >({});


  const [submitting, setSubmitting] =
    useState(false);



  function handleChange<
    K extends keyof FormValues
  >(
    field: K,
    value: FormValues[K]
  ) {

    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));

  }



  function handleSubmit(
    event: React.FormEvent
  ) {

    event.preventDefault();


    const newErrors:
      Partial<Record<keyof FormValues, string>>
      = {};


    if (!values.clientName.trim()) {
      newErrors.clientName =
        "نام موکل الزامی است.";
    }


    if (!values.phone.trim()) {
      newErrors.phone =
        "شماره تماس الزامی است.";
    }


    if (!values.sessionDate) {
      newErrors.sessionDate =
        "تاریخ جلسه الزامی است.";
    }


    if (!values.sessionTime) {
      newErrors.sessionTime =
        "ساعت جلسه الزامی است.";
    }


    setErrors(newErrors);


    if (
      Object.keys(newErrors).length > 0
    ) {
      return;
    }


    setSubmitting(true);


    setTimeout(() => {

      onSave(values);

      setSubmitting(false);

      onClose();

    }, 700);

  }



  return (

    <Modal
      onClose={onClose}
      maxWidthClass="max-w-xl"
    >

      <div>


        {/* Header */}

        <div className="
          flex
          items-center
          justify-between
          border-b
          border-[#EDEBE2]
          p-5
        ">

          <h2 className="
            text-lg
            font-bold
            text-[#262420]
          ">
            ثبت جلسه مشاوره
          </h2>


          <button
            onClick={onClose}
            className="
              text-[#8C8A80]
              hover:text-[#262420]
            "
          >
            <X size={20}/>
          </button>

        </div>



        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5"
        >



          {/* نام موکل */}

          <div>

            <RequiredLabel
              text="نام موکل"
            />

            <input
              value={values.clientName}
              onChange={(e)=>
                handleChange(
                  "clientName",
                  e.target.value
                )
              }
              className={fieldClass}
            />


            {errors.clientName && (
              <p className={errorClass}>
                {errors.clientName}
              </p>
            )}

          </div>




          {/* شماره تماس */}

          <div>

            <RequiredLabel
              text="شماره تماس"
            />

            <input
              value={values.phone}
              onChange={(e)=>
                handleChange(
                  "phone",
                  e.target.value
                )
              }
              className={fieldClass}
            />


            {errors.phone && (
              <p className={errorClass}>
                {errors.phone}
              </p>
            )}

          </div>




          {/* تاریخ و ساعت */}

          <div>

            <RequiredLabel
              text="تاریخ و ساعت جلسه"
            />


            <PersianDateTimePicker

              date={
                values.sessionDate
              }

              time={
                values.sessionTime
              }


              onChange={(date,time)=>{

                handleChange(
                  "sessionDate",
                  date
                );


                handleChange(
                  "sessionTime",
                  time
                );

              }}

            />



            {errors.sessionDate && (
              <p className={errorClass}>
                {errors.sessionDate}
              </p>
            )}



            {errors.sessionTime && (
              <p className={errorClass}>
                {errors.sessionTime}
              </p>
            )}


          </div>




          {/* توضیحات */}

          <div>

            <label className={labelClass}>
              توضیحات
            </label>


            <textarea
              rows={4}
              value={values.description}
              onChange={(e)=>
                handleChange(
                  "description",
                  e.target.value
                )
              }
              className={fieldClass}
              placeholder="
                در صورت نیاز توضیحی درباره جلسه وارد کنید...
              "
            />

          </div>




          {/* Buttons */}

          <div className="
            flex
            justify-end
            gap-3
            pt-2
          ">


            <button
              type="button"
              onClick={onClose}
              className="
                rounded-lg
                border
                border-[#E4E1D8]
                bg-white
                px-5
                py-2
                text-sm
                hover:bg-[#F7F5F0]
              "
            >
              انصراف
            </button>



            <button
              type="submit"
              disabled={submitting}
              className="
                rounded-lg
                bg-[#A9762F]
                px-6
                py-2
                text-sm
                font-medium
                text-white
                hover:bg-[#946A2A]
                disabled:opacity-50
              "
            >
              {
                submitting
                ? "در حال ثبت..."
                : "ثبت جلسه"
              }

            </button>


          </div>



        </form>


      </div>


    </Modal>

  );
}
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "../ui/use-toast";
import { useDispatch } from "react-redux";
import {
  eventTypeOptions,
  setEventStage,
  setSelectedEvent,
  StepEnum,
} from "@/store/event/eventSlice";

const SelectEventSchema = Yup.object().shape({
  eventType: Yup.string().required("Event type is required"),
});

const SelectEventModal = ({
  dialogTrigger,
}: {
  dialogTrigger: React.ReactNode;
}) => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const { toast } = useToast();

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select an Option</DialogTitle>
          <DialogDescription>
            Choose an option from the list below.
          </DialogDescription>
        </DialogHeader>
        <Formik
          initialValues={{ eventType: "" }}
          validationSchema={SelectEventSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setLoading(true);
            try {
              // Handle form submission
              dispatch(setEventStage(StepEnum.SET_EVENT_DATA));
              dispatch(setSelectedEvent(values.eventType));
              setIsModalOpen(false);
              toast({
                title: "Event type selected successfully",
                description: "success",
              });
            } catch (error) {
              toast({ title: (error as Error).message, description: "error" });
            } finally {
              setLoading(false);
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isValid }) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="eventType">
                  Event Type <span className="text-red-500">*</span>
                </label>
                <Field
                  as="select"
                  name="eventType"
                  id="eventType"
                  className="w-full p-2 border rounded"
                  placeHolder="Select an option"
                >
                  {eventTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
                {touched.eventType && errors.eventType && (
                  <div className="text-red-500">{errors.eventType}</div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full uppercase"
                disabled={!isValid || loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default SelectEventModal;

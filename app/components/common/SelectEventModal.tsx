import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "../ui/use-toast";
import { useDispatch } from "react-redux";
import { eventTypeOptions, setSelectedEvent } from "@/store/event/eventSlice";
import { useNavigate } from "@remix-run/react";

type EventDetails = {
  backendValue: string;
  frontendValue: string;
};

export const EventEnum: Record<string, EventDetails> = {
  SIGN_UP: {
    backendValue: "SIGN_UP",
    frontendValue: "Sign Up",
  },
  ORDER_CREATE: {
    backendValue: "ORDER_CREATE",
    frontendValue: "Order Create",
  },
};

const SelectEventSchema = Yup.object().shape({
  eventType: Yup.string().required("Event type is required"),
});

const SelectEventModal = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
            console.log("values event type", values);
            try {
              dispatch(setSelectedEvent(values.eventType));

              navigate(`/dashboard/event/new?event=${values.eventType}`);
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
                  {eventTypeOptions.map((option: any) => (
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

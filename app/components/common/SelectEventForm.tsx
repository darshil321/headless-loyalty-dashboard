"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StepEnum } from "@/routes/dashboard/route";
import { useAppDispatch } from "@/store/hooks";
import { setSelectedEvent } from "@/store/slices/eventSlice";

export const EventEnum = {
  SIGN_UP: "SIGN_UP",
  ORDER_CREATE: "ORDER_CREATE",
};

const FormSchema = z.object({
  selectedOption: z.enum([EventEnum.SIGN_UP, EventEnum.ORDER_CREATE]),
});

export function SelectEventForm({
  setEventStage,
  setIsModalOpen,
}: {
  setSelectedEvent?: (event: typeof EventEnum.SIGN_UP) => void;
  setEventStage: (stage: any) => void;
  setIsModalOpen: (isOpen: boolean) => void;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const dispatch = useAppDispatch();
  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("dataxxc", data);
    dispatch(setSelectedEvent(data.selectedOption));
    setEventStage(StepEnum.SET_EVENT_DATA);
    setIsModalOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="selectedOption"
          render={({ field }) => (
            <FormItem className="w-full">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={EventEnum.SIGN_UP}>Sign up</SelectItem>
                  <SelectItem value={EventEnum.ORDER_CREATE}>
                    Order Create
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant="primary"
          className=" bg-black text-white"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}

import EventForm from "@/components/event/EventForm";

export async function loader({ params }: { params: any }) {
  console.log("params", params);
  return null;
}

const route = () => {
  return (
    <div>
      <EventForm />
    </div>
  );
};

export default route;

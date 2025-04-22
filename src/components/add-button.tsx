import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const AddButton = () => {
  const router = useRouter();

  const handleAddPost = () => {
    router.push("/create-post");
  };

  return (
    <div className="justify-end p-4">
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={handleAddPost}
      >
        <Plus className="mr-2" />
        Add Posts
      </Button>
    </div>
  );
};

export default AddButton;

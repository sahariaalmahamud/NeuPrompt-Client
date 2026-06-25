import PromptDetails from "@/components/allprompts/details/PromptDetails";
import { getPromptById } from "@/lib/api/prompts";


export default async function PromptDetailsPage({ params }) {
  const { id } = await params;

  const prompt = await getPromptById(id);


  return (
    <div className="mt-8">
      <PromptDetails prompt={prompt} />
    </div>
  );
}
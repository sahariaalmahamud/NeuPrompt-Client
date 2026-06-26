import PromptDetails from "@/components/allprompts/details/PromptDetails";
import { getPromptById } from "@/lib/api/prompts";
import { getReviews } from "@/lib/api/reviews";


export default async function PromptDetailsPage({ params }) {
  const { id } = await params;

  const prompt = await getPromptById(id);
  const reviews = await getReviews(id);

  return (
    <div className="mt-8">
      <PromptDetails prompt={prompt} reviews={reviews}/>
    </div>
  );
}
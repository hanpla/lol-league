import { Match } from "@/types/match";
import {
  FAQ_LIST,
  generateWebsiteSchema,
  generateFaqSchema,
  generateSportsEventSchema,
} from "@/lib/utils/seo";

interface JsonLdProps {
  matches: Match[];
}

export default function JsonLd({ matches }: JsonLdProps) {
  const websiteSchema = generateWebsiteSchema();
  const faqSchema = generateFaqSchema(FAQ_LIST);
  const sportsEventSchemas = generateSportsEventSchema(matches);

  const schemas = [websiteSchema, faqSchema, ...sportsEventSchemas];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemas),
      }}
    />
  );
}

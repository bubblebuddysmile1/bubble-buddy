"use client";

import { useState } from "react";

type Tab = "description" | "benefits" | "howToApply" | "faq" | "details";

type ProductTabsProps = {
  description: string;
  benefits?: string | null;
  howToApply?: string | null;
  faq?: string | null;
  details?: string | null;
};

export default function ProductTabs({
  description,
  benefits,
  howToApply,
  faq,
  details,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("description");

  const tabs: Array<{ id: Tab; label: string; content: string | null | undefined }> = [
    { id: "description", label: "Description", content: description },
    { id: "benefits", label: "Benefits", content: benefits },
    { id: "howToApply", label: "How To Apply", content: howToApply },
    { id: "faq", label: "FAQ", content: faq },
    { id: "details", label: "Details", content: details },
  ];

  return (
    <section className="mt-12 space-y-6 rounded-[2rem] border border-border bg-card p-6 shadow-lg">
      {/* Tab Headers */}
      <div className="flex flex-wrap gap-2 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition ${
              activeTab === tab.id
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-50 space-y-4">
        {tabs.map((tab) => (
          activeTab === tab.id && (
            <div key={tab.id} className="space-y-4">
              {tab.content ? (
                <div
                  className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: tab.content }}
                />
              ) : (
                <p className="text-muted-foreground italic">
                  No {tab.label.toLowerCase()} available for this product.
                </p>
              )}
            </div>
          )
        ))}
      </div>
    </section>
  );
}

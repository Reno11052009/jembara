import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ChatBubbleWidget from "@/components/chatbot/ChatBubbleWidget";

describe("ChatBubbleWidget server rendering", () => {
  it("does not access the DOM while prerendering", () => {
    expect(() =>
      renderToString(
        <ChatBubbleWidget role="STUDENT" userId="server-rendered-user" />,
      ),
    ).not.toThrow();
  });
});

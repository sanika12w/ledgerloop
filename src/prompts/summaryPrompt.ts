export const summaryPrompt = (auditContext: string) => `
Generate a ~100-word executive summary of AI tool spending inefficiencies.

Rules:
- Be professional
- Mention overspending patterns if present
- Suggest optimization
- Keep under 100 words

Audit Data:
${auditContext}
`;
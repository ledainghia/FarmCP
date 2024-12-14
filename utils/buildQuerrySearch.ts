export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ''
    )
  );
  return searchParams.toString();
};

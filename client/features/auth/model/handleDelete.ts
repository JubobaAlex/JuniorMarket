export default async function handleDelete() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/delete`,
    {
      method: 'DELETE',
      credentials: 'include',
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || 'Не удалось удалить аккаунт',
    );
  }

  return data;
}

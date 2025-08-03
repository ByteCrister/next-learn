export function TitleInput({
  title,
  setTitle,
}: {
  title: string;
  setTitle: (value: string) => void;
}) {
  return (
    <input
      type="text"
      placeholder="Roadmap Title"
      className="w-full border px-3 py-2 rounded"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
  );
}

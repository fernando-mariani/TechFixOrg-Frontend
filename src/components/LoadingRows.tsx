export default function LoadingRows({ label }: { label: string }) {
  return (
    <div className="loading-rows" role="status">
      <span>{label}</span>
      <div className="loading-rows-preview" aria-hidden="true">
        <div><i /><i /></div>
        <div><i /><i /></div>
      </div>
    </div>
  );
}

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-6 px-8">
      <span className="font-bold text-2xl">Lensboard</span>
      <div className="flex gap-10">
        <a href="#">Product</a>
        <a href="#">Templates</a>
        <a href="#">Use Cases</a>
        <a href="#">Pricing</a>
        <a href="#">Docs</a>
      </div>
      <button className="button-primary text-base">Login</button>
    </nav>
  );
}

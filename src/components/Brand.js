import logo from '../images/logo.png';

function Brand({ footer = false }) {
  return (
    <a className={`brand${footer ? ' brand--footer' : ''}`} href="/" aria-label="Tseba Ka Lesotho home">
      <span className="brand__mark"><img src={logo} alt="" /></span>
      <span className="brand__text">Tseba Ka Lesotho</span>
    </a>
  );
}

export default Brand;

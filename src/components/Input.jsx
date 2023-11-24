const Input = ({ type, value, placeholder, onChange }) => {
  return (
    <div className="field">
      <label htmlFor={value}>Nom d'utilisateur</label>
      <input
        type={type}
        value={value}
        id={value}
        name={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;

export const CheckBoxComp = ({ propArray }) => {
  return (
    <form>
      {propArray.map((v, i) => {
        return (
          <div>
            <input
              checked={v.ischeckedfn}
              onChange={v.handleChange}
              type={v.inputType}
              id={v.id}
              name={v.name}
              value={v.value}
              disabled={v.disabled}
              style={v.style}
            />
            <label for="vehicle1">{v.label}</label>
          </div>
        );
      })}
    </form>
  );
};

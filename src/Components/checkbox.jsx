export const CheckBoxComp = ({propArray}) => {
  return (
    <form>
      {propArray.map((v, i) => {
        return (
          <div>
            <input type="checkbox" id={v.id} name={v.name} value={v.value} />
            <label for="vehicle1">{v.label}</label>
          </div>
        );
      })}
    </form>
  );
};

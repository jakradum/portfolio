
export const ButtonComponent = ({propArray}) => {
  return (
    <div>
      {propArray.map((v, i) => {
        return (
          <div key={i}>
            <button className="button-59" onClick={v.onclickfn}>{v.buttonText}</button>
          </div>
        );
      })}
    </div>
  );
};

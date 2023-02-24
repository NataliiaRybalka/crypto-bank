// @ts-ignore
function InsideMetaFields({ fields }): any {

  return (
    <table>
      {Object.keys(fields).map(objKey => (
        (objKey === 'accountKeys')
          ? (
            <tr>
              <td>{objKey}</td>
              <td>{fields[objKey].map((data: any) => <span key={objKey+Math.random()} className='fieldsMapData'>{data}, </span>)}</td>
            </tr>
          )
          : (
            <tr key={objKey+Math.random()}>
              <td>{objKey}</td>
              <td>{JSON.stringify(fields[objKey])}</td>
            </tr>
          )
      ))}
    </table>
  );
}

export default InsideMetaFields;

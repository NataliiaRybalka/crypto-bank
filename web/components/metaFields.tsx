import InsideMetaFields from './insideMetaFields';

// @ts-ignore
function MetaFields({ fields }): any {

  return (
    <table>
      {Object.keys(fields).map(objKey => (
        <tr key={objKey}>
          <td>{objKey}</td>
          {
            (objKey === 'postBalances' || objKey === 'preBalances' || objKey === 'logMessages' || objKey === 'signatures') 
              ? (
                <td>{fields[objKey].map((data: any) => <span key={objKey+Math.random()} className='fieldsMapData'>{data}, </span>)}</td>
              )
              : (!Array.isArray(fields[objKey])) 
                ? (objKey === 'message') 
                  ? <InsideMetaFields fields={fields[objKey]} key={objKey+Math.random()} />
                  : <td>{JSON.stringify(fields[objKey])}</td>
                : fields[objKey].map((field: any) => <InsideMetaFields fields={field} key={objKey+Math.random()} />)
          }
        </tr>
      ))}
    </table>
  );
}

export default MetaFields;

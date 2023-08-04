import { h } from 'preact';

function Filter({ filter, filterHandler, noResults }) {
  const handleFilterKeyDown = e => {
    if (e.keyCode === 27) {
      handleFilterClear();
    }
  };

  const handleFilterClear = () => {
    filterHandler({ target: { value: '' } });
  };

  return (
    <div className="filter">
      <input
        className={`${filter ? 'button-visible' : ''}${noResults ? ' noresults' : ''}`}
        type="text"
        value={filter}
        onKeyDown={handleFilterKeyDown}
        onInput={filterHandler}
        autoComplete={false}
        placeholder="Filter modules and plugins..."
      ></input>
      {filter && <button onClick={handleFilterClear}>X</button>}
    </div>
  );
}

export default Filter;

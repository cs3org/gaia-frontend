import { h } from 'preact';

import Filter from './filter';
import Module from './module';

import Loading from '../assets/loading.svg';

function ModuleList({ loading, modules, filter, filterHandler, selection, selectionHandler }) {
  const filteredModules = loading
    ? []
    : modules.filter(
        /* Filter:
         * 1. Exclude any module that is explicitly unlisted
         * 2. Include any selected module
         * 3. Include everything else if there is no filter term
         * 4. Include any module which name includes the filter term
         * 5. Include any module with a plugin which name includes the filter term
         */
        module =>
          module.listed !== false &&
          (selection.some(s => module.module.includes(s)) ||
            !filter ||
            module.module.includes(filter) ||
            module.plugins.some(plugin => plugin.name.includes(filter)))
      );

  return (
    <section>
      <Filter filter={filter} filterHandler={filterHandler} noResults={!filteredModules.length} />
      {loading ? (
        <div className="loading">
          <Loading />
        </div>
      ) : (
        filteredModules.map(module => (
          <Module
            {...module}
            selected={selection.includes(module.module)}
            moduleHandler={selectionHandler}
          />
        ))
      )}
    </section>
  );
}

export default ModuleList;

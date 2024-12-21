import React from 'react';
import KanBanApp from './kanban-app';
import { defaultCols, defaultTasks } from './data';

const KanBanPage = () => {
  return <KanBanApp defaultCols={defaultCols} />;
};

export default KanBanPage;

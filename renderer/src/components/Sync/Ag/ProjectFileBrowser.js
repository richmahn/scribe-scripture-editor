import {
 useContext, useEffect,
} from 'react';
import GridRow from '../GridRow';
import { SyncContext } from '../SyncContextProvider';

export default function ProjectFileBrowser() {
  const {
    states: {
    agProjects, agProjectsMeta, selectedAgProject, syncProgress,
  },
    action: {
      fetchProjects, setSelectedAgProject,
    },
  } = useContext(SyncContext);

  useEffect(() => {
    const getProjects = async () => {
      await fetchProjects();
    };
    getProjects();
    // eslint-disable-next-line
  }, []);

  const handleSelectProject = (currentProject) => {
    if (selectedAgProject?.projectName === currentProject) {
      setSelectedAgProject(undefined);
    } else {
      const currentMeta = agProjectsMeta.filter((projectData) => projectData?.identification?.name?.en === currentProject);
      setSelectedAgProject({ projectName: currentProject, projectMeta: currentMeta[0] });
    }
  };

  return (
    agProjectsMeta?.map((projectMeta) => (
      // not listing audio project in sync list
      agProjects.filter((project) => projectMeta?.identification?.name?.en === project && projectMeta?.type?.flavorType?.flavor?.name !== 'audioTranslation'
      && !projectMeta?.project[projectMeta?.type?.flavorType?.flavor?.name]?.isArchived).length > 0
      && (
        <div key={projectMeta?.identification?.name?.en} role="button" onClick={() => handleSelectProject(projectMeta?.identification?.name?.en)} tabIndex={-1}>
          <GridRow
            key={projectMeta?.identification?.name?.en}
            title={projectMeta?.identification?.name?.en}
            lastSync={projectMeta?.lastSync}
            selected={selectedAgProject?.projectName === projectMeta?.identification?.name?.en}
            isUpload={selectedAgProject?.projectName === projectMeta?.identification?.name?.en && syncProgress.syncStarted}
            uploadPercentage={(syncProgress.completedFiles * 100) / syncProgress.totalFiles}
          />
        </div>
      )
    ))
);
}

import {
    fetchColors, fetchLabels, fetchTasks, fetchSections, fetchProjects,
} from "./ApiCalls.actions";
import {produce} from "immer";
import axios from "../../AxiosInstance";

export const START_FETCH_DATA = "START_FETCH_DATA";
export const FINISH_FETCH_DATA = "FINISH_FETCH_DATA";
export const FETCH_DATA_FAILED = "FETCH_DATA_FAILED";

export const START_REFRESH_DATA = "START_REFRESH_DATA";
export const FINISH_REFRESH_DATA = "FINISH_REFRESH_DATA";
export const REFRESH_DATA_FAILED = "REFRESH_DATA_FAILED";

export const SET_DATA = "SET_DATA";

export const SET_APP_THEME = "SET_APP_THEME";

export const startRefreshData = () => ({type: START_REFRESH_DATA});
export const finishRefreshData = () => ({type: FINISH_REFRESH_DATA});
export const refreshDataFailed = () => ({type: REFRESH_DATA_FAILED});
export const startFetchData = () => ({type: START_FETCH_DATA});
export const finishFetchData = () => ({type: FINISH_FETCH_DATA});
export const fetchDataFailed = () => ({type: FETCH_DATA_FAILED});
export const setData = (data) => ({type: SET_DATA, ...data});

export const setAppTheme = (themeName = null) => ({type: SET_APP_THEME, themeName})

export const refreshAllData = () => {
    return async (dispatch, getState) => {
        try {
            dispatch(startRefreshData());

            const sections = {};

            const inboxSections = await dispatch(fetchSections({project: getState().main.inbox.project.id}));

            inboxSections.forEach((section) => {
                sections[section.title] = {id: section.id, tasks: []};
            });

            const tasks = await dispatch(fetchTasks());

            tasks.forEach((task) => {
                sections[task.section.title].tasks.push(task);
            });

            // dispatch(
            //   setData({
            //     sections,
            //   })
            // );
            dispatch(finishRefreshData());
        } catch (error) {
            dispatch(refreshDataFailed());
            throw error;
        }
    };
};

export const refreshData = (partsName = []) => {
    return async (dispatch, getState) => {
        try {
            dispatch(startRefreshData());

            // if (partsName.includes("sections")) {
            //   const sections = {};
            //
            //   const inboxSections = await dispatch(
            //     fetchSections({ project: getState().main.inbox.project.id })
            //   );
            //
            //   inboxSections.forEach((section) => {
            //     sections[section.title] = { id: section.id, tasks: [] };
            //   });
            //
            //   const tasks = await dispatch(fetchTasks());
            //
            //   tasks.forEach((task) => {
            //     sections[task.section.title].tasks.push(task);
            //   });
            //
            //   dispatch(setData({ sections }));
            // }
            //
            // if (partsName.includes("projects")) {
            // }
            //
            // if (partsName.includes("labels")) {
            //   const labels = await dispatch(fetchLabels());
            //   dispatch(setData({ labels }));
            // }

            dispatch(finishRefreshData());
        } catch (error) {
            dispatch(refreshDataFailed());
            throw error;
        }
    };
};

export const fetchData = () => {
    return async (dispatch) => {
        try {
            dispatch(startFetchData());
            // let inboxProject = await axios.get("/projects/?project__title=inbox");
            //
            // inboxProject = inboxProject.data.results[0];
            // const inboxProjectId = inboxProject.project.id;

            // const sections = {};
            //
            // const inboxSections = await dispatch(
            //   fetchSections({ project: inboxProjectId })
            // );

            // inboxSections.forEach((section) => {
            //   const { title, ...sec } = section;
            //   sections[title] = { ...sec, tasks: [] };
            // });
            //
            // const allTasks = await dispatch(fetchTasks());
            //
            // allTasks.forEach((task) => {
            //   sections[task.section.title].tasks.push(task);
            // });

            let projects = await dispatch(fetchProjects({project__project__isnull: true}));

            const labels = await dispatch(fetchLabels());

            // const colors = await dispatch(fetchColors());

            dispatch(setData({projects, labels}));

            dispatch(finishFetchData())
        } catch (error) {
            dispatch(fetchDataFailed());
            console.log(error);
            throw error;
        }
    };
};

/**
 * This action change position of ( Task - Section - Project )
 *  @param {string} parentType - type of parent that contain the item [ task - section - project ]
 *  @param {string} itemType - type of item that should be changed [ task - section - project ]
 *  @param {number} id
 *  @param {number} oldIndex
 *  @param {number} newIndex
 *  @param {Array} list - a list that needs to be changed
 * **/

export const changePosition = (parentType, itemType, id, oldIndex, newIndex, list) => {
        return async (dispatch) => {
            try {
                let copyOfList = [...list];
                const oldPosition = copyOfList[oldIndex].position;
                const newPosition = copyOfList[newIndex].position;
                const itemId = copyOfList[oldIndex].id;

                if (oldPosition > newPosition) {
                    const start = newPosition;
                    const finish = oldPosition - 1;
                    copyOfList.forEach((task, index) => {
                        if (task.position >= start && task.position <= finish) {
                            copyOfList[index] = {...copyOfList[index], position: task.position + 1};
                        }
                    })
                } else {
                    const start = oldPosition + 1;
                    const finish = newPosition;
                    copyOfList.forEach((task, index) => {
                        if (task.position >= start && task.position <= finish) {
                            copyOfList[index] = {...copyOfList[index], position: task.position - 1};
                        }
                    })
                }

                copyOfList[oldIndex] = {...copyOfList[oldIndex], position: newPosition};

                const sortedTasksList = produce(copyOfList, draft => {
                    draft.sort((a, b) => a.position > b.position)
                });

                dispatch(setData({
                    modify: {
                        type: parentType,
                        part: 'projects',
                        id,
                        key: 'id',
                        data: {tasks: sortedTasksList},
                        nestedProperties: ['projects', 'sections', 'tasks'],
                        compareDeepChanges: false
                    }
                }));

                await axios.post("/changeposition/", {
                    obj: itemId,
                    position: newPosition
                }, {
                    params: {type: itemType},
                });

            } catch (error) {
                throw error;
            }
        };
    }
;

import React from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useProjectQuery} from "hooks/useProjectsData";
import LoadingWrapper from "components/UI/LoadingWrapper";
import PageContainer from "components/UI/PageContainer";
import ProjectHeader from "./components/ProjectHeader";
import ProjectBody from "./components/ProjectBody";
import "./projectPage.scss";

const ProjectPage = () => {
    const {id, parentId} = useParams();
    const navigate = useNavigate();
    const {data: project, isLoading: isProjectLoading, isError, error} = useProjectQuery(Number(id), Number(parentId));

    if (isError) {
        console.log(error);
        navigate('/404');
    }

    const renderProject = () => {
        return (
            !!project && (
                <React.Fragment>
                    <ProjectHeader project={project}/>
                    <ProjectBody project={project}/>
                </React.Fragment>
            )
        )
    }

    return (
            <PageContainer>
                <div className="project-page-container">
                    <LoadingWrapper show={!isProjectLoading} type="circle" size="lg" onLoaded={renderProject}/>
                </div>
            </PageContainer>
    );
}

export default ProjectPage;
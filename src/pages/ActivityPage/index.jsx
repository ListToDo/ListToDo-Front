import React, {useState} from "react";
import PageContainer from "components/UI/PageContainer";
import ActivityChart from "components/ActivityChart";
import ActivityTree from "components/ActivityTree";
import "./activityPage.scss";

const ActivityPage = () => {
    const [testDate] = useState(() => {
        const tenDaysAgo = new Date();
        tenDaysAgo.setMonth(tenDaysAgo.getMonth() - 3)
        return {
            today: new Date(),
            oneMonthAgo: tenDaysAgo
        }
    });

    return (
        <PageContainer>
            <div className="activity-page-container">
                <ActivityTree />
                <ActivityChart gte={testDate.oneMonthAgo} lte={testDate.today}/>
            </div>
        </PageContainer>
    );
}

export default ActivityPage;
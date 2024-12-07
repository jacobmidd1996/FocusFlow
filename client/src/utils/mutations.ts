import { gql } from '@apollo/client';

export const ADD_TASK = gql`
    mutation AddTask($title: String!, $description: String!) {
        addTask(title: $title, description: $description) {
            id
            title
            description
            status
        }
    }
`;

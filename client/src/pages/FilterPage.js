import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { gql, useQuery, useMutation } from '@apollo/client';
import { useAuth } from '../hooks/useAuth';
import MatchCard from '../components/MatchCard';
const GET_MY_PROFILE = gql `
  query GetMyProfile {
    me {
      id
      strengths
      needs
    }
  }
`;
const FIND_MATCHES = gql `
  query FindMatches($strengths: [String!]!, $needs: [String!]!) {
    findMatches(strengths: $strengths, needs: $needs) {
      id
      name
      email
      description
      strengths
      needs
    }
  }
`;
const ADD_MATCH = gql `
  mutation AddMatch($userId: ID!, $matchId: ID!) {
    addMatch(userId: $userId, matchId: $matchId) {
      success
    }
  }
`;
const REMOVE_MATCH = gql `
  mutation RemoveMatch($userId: ID!, $matchId: ID!) {
    removeMatch(userId: $userId, matchId: $matchId) {
      success
    }
  }
`;
export default function FilterPage() {
    const { token } = useAuth();
    const { data: profileData, loading: profileLoading, error: profileError } = useQuery(GET_MY_PROFILE);
    const { data: matchesData, loading: matchesLoading, error: matchesError } = useQuery(FIND_MATCHES, {
        skip: profileLoading || !!profileError,
        variables: {
            strengths: profileData?.me.strengths || [],
            needs: profileData?.me.needs || []
        }
    });
    const [addMatch] = useMutation(ADD_MATCH);
    const [removeMatch] = useMutation(REMOVE_MATCH);
    if (profileLoading || matchesLoading)
        return _jsx("p", { children: "Loading\u2026" });
    if (profileError || matchesError)
        return _jsx("p", { children: "Error loading matches." });
    return (_jsxs("div", { children: [_jsx("h1", { children: "Potential Tutors" }), matchesData.findMatches.map((m) => (_jsx(MatchCard, { match: m, onAdd: async () => {
                    await addMatch({
                        variables: { userId: profileData.me.id, matchId: m.id }
                    });
                }, onRemove: async () => {
                    await removeMatch({
                        variables: { userId: profileData.me.id, matchId: m.id }
                    });
                } }, m.id)))] }));
}
//# sourceMappingURL=FilterPage.js.map
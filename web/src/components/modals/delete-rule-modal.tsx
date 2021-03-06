/**
 * Panther is a scalable, powerful, cloud-native SIEM written in Golang/React.
 * Copyright (C) 2020 Panther Labs Inc
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react';
import { DeletePolicyInput, RuleSummary, RuleDetails } from 'Generated/schema';

import { useMutation, gql } from '@apollo/client';
import useRouter from 'Hooks/useRouter';
import urls from 'Source/urls';
import { getOperationName } from '@apollo/client/utilities/graphql/getFromAST';
import { LIST_RULES } from 'Pages/list-rules';
import BaseConfirmModal from 'Components/modals/base-confirm-modal';

// Delete Rule and Delete Policy uses the same endpoint
const DELETE_RULE = gql`
  mutation DeletePolicy($input: DeletePolicyInput!) {
    deletePolicy(input: $input)
  }
`;

export interface DeleteRuleModalProps {
  rule: RuleDetails | RuleSummary;
}

const DeleteRuleModal: React.FC<DeleteRuleModalProps> = ({ rule }) => {
  const { location, history } = useRouter<{ id?: string }>();
  const ruleDisplayName = rule.displayName || rule.id;
  const mutation = useMutation<boolean, { input: DeletePolicyInput }>(DELETE_RULE, {
    awaitRefetchQueries: true,
    refetchQueries: [getOperationName(LIST_RULES)],
    variables: {
      input: {
        policies: [
          {
            id: rule.id,
          },
        ],
      },
    },
  });

  return (
    <BaseConfirmModal
      mutation={mutation}
      title={`Delete ${ruleDisplayName}`}
      subtitle={`Are you sure you want to delete ${ruleDisplayName}?`}
      onSuccessMsg={`Successfully deleted ${ruleDisplayName}`}
      onErrorMsg={`Failed to delete ${ruleDisplayName}`}
      onSuccess={() => {
        if (location.pathname.includes(rule.id)) {
          // if we were on the particular rule's details page or edit page --> redirect on delete
          history.push(urls.logAnalysis.rules.list());
        }
      }}
    />
  );
};

export default DeleteRuleModal;

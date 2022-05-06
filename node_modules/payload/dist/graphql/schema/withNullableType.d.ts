import { GraphQLType } from 'graphql';
import { NonPresentationalField } from '../../fields/config/types';
declare const withNullableType: (field: NonPresentationalField, type: GraphQLType, forceNullable?: boolean) => GraphQLType;
export default withNullableType;

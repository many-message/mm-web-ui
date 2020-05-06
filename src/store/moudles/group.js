import { Request } from "../../util";
import { message } from "ant-design-vue";

const state = {
  groupInfo: {},
};

const getters = {};

const actions = {
  /**
   * 查询群聊详情
   * @param {*} param0
   * @param {*} groupId
   */
  getGroup({ commit }, groupId) {
    Request.get(`/groups/${groupId}/detail`).then(data =>
      commit("updateGroupInfo", data),
    );
  },
  /**
   * 编辑群聊信息
   * @param {*} param0
   * @param { editGroupInfo, success, errror } payload
   */
  editGroup({ commit }, payload) {
    Request.put("/groups", payload.editGroupInfo)
      .then(data => {
        commit("updateGroupInfo", data);
        message.success("修改成功！");
        payload.success();
      })
      .catch(() => payload.error());
  },
  /**
   * 修改成员类型
   * @param {*} param0
   * @param {groupMemberId, groupMemberType} payload
   */
  updateGroupMemberType({ commit }, payload) {
    Request.patch(
      `/group-members/${payload.groupMemberId}/types?groupMemberType=${payload.groupMemberType}`,
    ).then(data => {
      commit("updateGroupMembers", data);
      message.success("修改成功！");
    });
  },
  /**
   * 修改备注名
   * @param {*} param0
   * @param { groupMemberId, groupMemberName, success, error } payload
   */
  updateGroupMemberName({ commit }, payload) {
    Request.patch(
      `/group-members/${payload.groupMemberId}/names?groupName=${payload.groupMemberName}`,
    )
      .then(data => {
        commit("updateGroupInfo", data);
        message.success("修改成功！");
        payload.success();
      })
      .catch(() => payload.error());
  },
};

const mutations = {
  updateGroupInfo(state, payload) {
    state.groupInfo = payload;
  },
  updateGroupMembers(state, payload) {
    const { groupMembers, ...rest } = state.groupInfo;
    state.groupInfo = {
      ...rest,
      groupMembers: groupMembers ? payload : payload,
    };
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

import { Request } from "../../util";
import { message } from "ant-design-vue";

const state = {
  groupInfo: {},
  inviteJoinGroupUsers: [],
};

const getters = {
  userIds: state => {
    const userIds = [];
    state.groupInfo.groupMembers.forEach(member => userIds.push(member.userId));
    return userIds;
  },
  joinGroupUsers: state => {
    const users = [];
    state.inviteJoinGroupUsers.forEach(item => {
      const user = {
        key: item.userId,
        title: item.friendName,
        description: item.nickname,
        disabled: false,
      };
      users.push(user);
    });
    return users;
  },
};

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
  /**
   * 删除一个成员
   * @param {*} param0
   * @param {groupMemberId, success} payload
   */
  deleteGroupMember({ commit }, payload) {
    Request.delete(`/group-members/${payload.groupMemberId}`).then(data => {
      commit("updateGroupMembers", data);
      payload.success();
      message.success("移除成功！");
    });
  },
  /**
   * 退出群聊
   * @param {*} param0
   * @param {groupId, success} payload
   */
  leaveGroup({ commit }, payload) {
    Request.delete(`/groups/${payload.groupId}/members`).then(data => {
      commit("cantact/updateGroups", data, { root: true });
      message.success("退出成功！");
      payload.success();
    });
  },
  /**
   * 解散群
   * @param {*} param0
   * @param {groupId, success} payload
   */
  deleteGroup({ commit }, payload) {
    Request.delete(`/groups/${payload.groupId}`).then(data => {
      commit("cantact/updateGroups", data, { root: true });
      message.success("解散成功！");
      payload.success();
    });
  },
  /**
   * 查询邀请入群好友信息
   * @param {*} param0
   * @param {groupId, success} payload
   */
  getInviteJoinGroupUsers({ commit }, payload) {
    Request.get(`/friends/${payload.groupId}/not`).then(data => {
      commit("updateInviteJoinGroupUsers", data);
      payload.success();
    });
  },
  /**
   * 邀请好友加入群
   * @param {*} content
   * @param {inviteJoinInfo, success, error} payload
   */
  inviteJoinGroup(content, payload) {
    Request.post("/group-join-invites", payload.inviteJoinInfo)
      .then(() => {
        message.success("邀请已发出！");
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
  updateInviteJoinGroupUsers(state, payload) {
    state.inviteJoinGroupUsers = payload;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

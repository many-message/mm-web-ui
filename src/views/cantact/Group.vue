<template>
  <div>
    <a-result :title="groupInfo.groupName">
      <template #icon>
        <a-avatar slot="avatar" class="photo">{{
          sliceName(groupInfo.groupName)
        }}</a-avatar>
      </template>
      <template #subTitle>
        <a-descriptions>
          <a-descriptions-item label="群名称">
            {{ groupInfo.groupName }}
          </a-descriptions-item>
          <a-descriptions-item label="群号">
            {{ groupInfo.groupNum }}
          </a-descriptions-item>
          <a-descriptions-item label="群简介">
            {{ groupInfo.groupDesc }}
          </a-descriptions-item>
          <a-descriptions-item label="群主">
            {{ groupInfo.groupOwnerName }}
          </a-descriptions-item>
        </a-descriptions>
      </template>
      <template #extra>
        <a-button type="primary">发送消息</a-button>
        <a-button
          v-if="groupInfo.myGroupMemberType !== '3'"
          @click="showEditGroupModal"
        >
          编辑群聊
        </a-button>
        <a-button
          v-if="groupInfo.myGroupMemberType !== '3'"
          @click="showInviteJoinGroupModal"
        >
          添加成员
        </a-button>
        <a-popconfirm
          v-if="groupInfo.myGroupMemberType === '1'"
          title="您确定要解散群聊吗？"
          ok-text="非常确定"
          cancel-text="再想一下"
          @confirm="handleDeleteGorup"
        >
          <a-button type="danger">解散群聊</a-button>
        </a-popconfirm>
        <a-popconfirm
          v-else
          title="您确定要退出群聊吗？"
          ok-text="非常确定"
          cancel-text="再想一下"
          @confirm="handleLeaveGroup"
        >
          <a-button type="danger">退出群聊</a-button>
        </a-popconfirm>
        <!-- 群成员 -->
        <a-card title="群成员" :style="{ marginTop: '30px' }">
          <a-table
            :columns="columns"
            :data-source="groupInfo.groupMembers"
            row-key="groupMemberId"
          >
            <span slot="groupMemberType" slot-scope="groupMemberType">
              <a-tag
                :color="
                  groupMemberType === '1'
                    ? 'orange'
                    : groupMemberType === '2'
                    ? 'green'
                    : ''
                "
              >
                {{
                  groupMemberType === "1"
                    ? "群主"
                    : groupMemberType === "2"
                    ? "管理员"
                    : "成员"
                }}
              </a-tag>
            </span>
            <!-- 普通用户 -->
            <span
              v-if="groupInfo.myGroupMemberType === '3'"
              slot="action"
              slot-scope="record"
            >
              <a
                v-if="record.userId === groupInfo.myUserId"
                @click="
                  showEditGroupMemberNameModal(
                    record.groupMemberId,
                    record.groupMemberName,
                  )
                "
              >
                修改备注
              </a>
            </span>
            <!-- 管理员 -->
            <span
              v-else-if="groupInfo.myGroupMemberType === '2'"
              slot="action"
              slot-scope="record"
            >
              <a
                v-if="record.userId === groupInfo.myUserId"
                @click="
                  showEditGroupMemberNameModal(
                    record.groupMemberId,
                    record.groupMemberName,
                  )
                "
              >
                修改备注
              </a>
              <div v-if="record.groupMemberType === '3'">
                <a
                  @click="
                    showEditGroupMemberNameModal(
                      record.groupMemberId,
                      record.groupMemberName,
                    )
                  "
                >
                  修改备注
                </a>
                <a-divider type="vertical" />
                <a
                  @click="
                    handleDeleteGroupMember(record.groupMemberId, record.userId)
                  "
                >
                  移除
                </a>
              </div>
            </span>
            <!-- 群主 -->
            <span
              v-else-if="groupInfo.myGroupMemberType === '1'"
              slot="action"
              slot-scope="record"
            >
              <a
                v-if="record.userId === groupInfo.myUserId"
                @click="
                  showEditGroupMemberNameModal(
                    record.groupMemberId,
                    record.groupMemberName,
                  )
                "
              >
                修改备注
              </a>
              <div v-if="record.groupMemberType !== '1'">
                <a
                  @click="
                    showEditGroupMemberNameModal(
                      record.groupMemberId,
                      record.groupMemberName,
                    )
                  "
                >
                  修改备注
                </a>
                <a-divider type="vertical" />
                <a
                  @click="
                    handleUpdateMemberType(
                      record.groupMemberId,
                      record.groupMemberType,
                    )
                  "
                >
                  变更类型
                </a>
                <a-divider type="vertical" />
                <a
                  @click="
                    handleDeleteGroupMember(record.groupMemberId, record.userId)
                  "
                >
                  移除
                </a>
              </div>
            </span>
          </a-table>
        </a-card>
      </template>
    </a-result>
    <!-- 编辑群聊 -->
    <a-modal
      title="编辑群聊"
      :visible="editGroupVisible"
      :confirm-loading="editGroupConfirmLoadding"
      @ok="handleEditGroupOk"
      @cancel="handelEditGroupCancel"
    >
      <a-input
        v-model="editGroupInfo.groupName"
        @change="handleEditGroupNameChange"
        placeholder="请输入群聊名称"
      />
      <a-input
        v-model="editGroupInfo.groupDesc"
        @change="handleEditGroupDescChange"
        placeholder="请输入群聊描述"
        :style="{ marginTop: '20px' }"
      />
    </a-modal>
    <!-- 编辑备注 -->
    <a-modal
      title="编辑备注"
      :visible="editGroupMemberNameVisible"
      :confirm-loading="editGroupMemberNameConfirmLoadding"
      @ok="handleEditGroupMemberNameOk"
      @cancel="handleEditGroupMemberNameCancel"
    >
      <a-input
        v-model="editGroupMemberName"
        @change="handelEditGroupMemberNameChange"
        placeholder="请输入备注名"
      />
    </a-modal>
    <!-- 邀请好友加入群聊 -->
    <a-modal
      title="邀请成员"
      :visible="inviteJoinGroupVisible"
      :confirm-loading="inviteJoinGroupConfirmLoadding"
      @ok="handleInviteJoinGroupOk"
      @cancel="handleInviteJoinGroupCancel"
    >
      <a-transfer
        :data-source="joinGroupUsers"
        :target-keys="joinUsers"
        :titles="['好友', '群聊']"
        :render="item => item.title"
        @change="handleChange"
      />
    </a-modal>
  </div>
</template>

<script>
import { createNamespacedHelpers, mapMutations } from "vuex";
import { sliceNickname, MsgType } from "@/util";

const { mapState, mapActions, mapGetters } = createNamespacedHelpers("group");

const columns = [
  {
    title: "类型",
    dataIndex: "groupMemberType",
    scopedSlots: { customRender: "groupMemberType" },
  },
  {
    title: "群备注",
    dataIndex: "groupMemberName",
  },
  {
    title: "昵称",
    dataIndex: "nickname",
  },
  {
    title: "邮箱",
    dataIndex: "email",
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  props: ["groupId"],
  data() {
    return {
      columns,
      // 编辑群聊
      editGroupVisible: false,
      editGroupConfirmLoadding: false,
      editGroupInfo: {
        groupId: null,
        groupName: null,
        groupDesc: null,
      },
      // 编辑备注
      editGroupMemberNameVisible: false,
      editGroupMemberNameConfirmLoadding: false,
      editGroupMemberId: null,
      editGroupMemberName: null,
      // 邀请成员
      inviteJoinGroupVisible: false,
      inviteJoinGroupConfirmLoadding: false,
      joinUsers: [],
    };
  },
  computed: {
    ...mapState(["groupInfo"]),
    ...mapGetters(["userIds", "joinGroupUsers"]),
  },
  watch: {
    // 监听路由变化
    $route: "handleGetGroupInfo",
  },
  methods: {
    ...mapActions([
      "getGroup",
      "editGroup",
      "updateGroupMemberType",
      "updateGroupMemberName",
      "deleteGroupMember",
      "leaveGroup",
      "deleteGroup",
      "getInviteJoinGroupUsers",
      "inviteJoinGroup",
    ]),
    ...mapMutations("socket", ["sendMsg"]),
    handleGetGroupInfo() {
      this.getGroup(this.groupId);
    },
    sliceName(name) {
      return sliceNickname(name);
    },
    // 编辑群聊信息
    showEditGroupModal() {
      const { groupId, groupName, groupDesc } = this.groupInfo;
      this.editGroupInfo = {
        groupId,
        groupName,
        groupDesc,
      };
      this.editGroupVisible = true;
    },
    handleEditGroupNameChange() {
      if (this.editGroupInfo.groupName) {
        this.editGroupInfo.groupName = this.editGroupInfo.groupName.trim();
      }
    },
    handleEditGroupDescChange() {
      if (this.editGroupInfo.groupDesc) {
        this.editGroupInfo.groupDesc = this.editGroupInfo.groupDesc.trim();
      }
    },
    handleEditGroupOk() {
      if (!this.editGroupInfo.groupName) {
        this.$message.error("请输入群聊名称！");
        return;
      }
      if (!this.editGroupInfo.groupDesc) {
        this.$message.error("请输入群聊描述！");
        return;
      }
      this.editGroupConfirmLoadding = true;
      // 编辑群聊
      this.editGroup({
        editGroupInfo: this.editGroupInfo,
        success: () => {
          this.editGroupConfirmLoadding = false;
          this.editGroupVisible = false;
        },
        error: () => {
          this.editGroupConfirmLoadding = false;
        },
      });
    },
    handelEditGroupCancel() {
      this.editGroupVisible = false;
    },
    // 修改类型
    handleUpdateMemberType(groupMemberId, groupMemberType) {
      this.updateGroupMemberType({
        groupMemberId,
        groupMemberType: ["", "", "3", "2"][Number(groupMemberType)],
      });
    },
    // 编辑备注
    showEditGroupMemberNameModal(groupMemberId, groupMemberName) {
      this.editGroupMemberId = groupMemberId;
      this.editGroupMemberName = groupMemberName;
      this.editGroupMemberNameVisible = true;
    },
    handelEditGroupMemberNameChange() {
      if (this.editGroupMemberName) {
        this.editGroupMemberName = this.editGroupMemberName.trim();
      }
    },
    handleEditGroupMemberNameOk() {
      if (!this.editGroupMemberName) {
        this.$message.error("请输入备注名！");
        return;
      }
      this.editGroupMemberNameConfirmLoadding = true;
      // 编辑备注名
      this.updateGroupMemberName({
        groupMemberId: this.editGroupMemberId,
        groupMemberName: this.editGroupMemberName,
        success: () => {
          this.editGroupMemberNameConfirmLoadding = false;
          this.editGroupMemberNameVisible = false;
        },
        error: () => {
          this.editGroupMemberNameConfirmLoadding = false;
        },
      });
    },
    handleEditGroupMemberNameCancel() {
      this.editGroupMemberNameVisible = false;
    },
    // 移除群成员
    handleDeleteGroupMember(groupMemberId, userId) {
      this.deleteGroupMember({
        groupMemberId,
        success: () => {
          this.sendMsg({
            msgType: MsgType.DEL_GROUP_MEMBER_NOTICE,
            content: {
              recvUserId: userId,
            },
          });
        },
      });
    },
    // 退群
    handleLeaveGroup() {
      this.leaveGroup({
        groupId: this.groupId,
        success: () => {
          this.$router.push("/home/cantact");
        },
      });
    },
    // 解散群
    handleDeleteGorup() {
      this.deleteGroup({
        groupId: this.groupId,
        success: () => {
          this.sendMsg({
            msgType: MsgType.DEL_GROUP_NOTICE,
            content: {
              recvUserIds: this.userIds,
            },
          });
          this.$router.push("/home/cantact");
        },
      });
    },
    // 邀请成员
    showInviteJoinGroupModal() {
      this.getInviteJoinGroupUsers({
        groupId: this.groupId,
        success: () => {
          this.joinUsers = [];
          this.inviteJoinGroupVisible = true;
        },
      });
    },
    handleChange(nextTargetKeys) {
      this.joinUsers = nextTargetKeys;
    },
    handleInviteJoinGroupOk() {
      this.inviteJoinGroupConfirmLoadding = true;
      // 邀请好友加入群聊
      this.inviteJoinGroup({
        inviteJoinInfo: {
          groupId: this.groupId,
          inviteUserIds: this.joinUsers,
        },
        success: () => {
          this.inviteJoinGroupConfirmLoadding = false;
          this.inviteJoinGroupVisible = false;
          // 同步发送消息
          this.sendMsg({
            msgType: MsgType.INVITE_JOIN_GROUP_NOTICE,
            content: {
              inviteUserIds: this.joinUsers,
            },
          });
        },
        error: () => {
          this.inviteJoinGroupConfirmLoadding = false;
        },
      });
    },
    handleInviteJoinGroupCancel() {
      this.inviteJoinGroupVisible = false;
    },
  },
  mounted() {
    this.handleGetGroupInfo();
  },
};
</script>

<style lang="less" scoped>
.photo {
  font-size: 20px;
  width: 60px;
  height: 60px;
  line-height: 60px;
  background: #1da57a;
}
</style>

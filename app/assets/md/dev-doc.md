#### 开发流程
![image.png](/assets/img/dev-step.png)
#### 登录地址
IaC平台登录地址：[http://10.0.3.124](http://10.0.3.124) (实际部署时使用域名 [http://iac.domain](http://iac.domain))
代码仓库登录地址：[http://10.0.3.124:3000](http://10.0.3.124:3000) (实际部署时使用域名 [http://iac-git.domain](http://iac-git.domain))
#### 登录用户名、密码
使用注册时填写的邮箱和密码直接登录，如果是组织管理员为您创建的用户，创建完成后登录信息将会邮件发送到您的邮箱
#### 脚手架获取
```shell
# cd /opt
# git clone http://10.0.3.124:3000/iac/example.git
```
#### 目录文件说明
```shell
ansible                 # ansible目录，存放playbook
playbook.yaml           # 资源创建成功后调用ansible playbook部署应用，可存在多个yaml文件，运行时通过传参决定调用哪个
main.tf                 # terraform主配置文件
provider.tf             # 引用的providers
variables.tf            # 变量定义，IaC平台添加云模板时会解析该文件提取变量名称、默认值以及描述
README.md               # 该仓库的说明，覆盖的场景、架构图等
xxx.tfvars              # 以tfvars为扩展名的文件是默认配置，优先级高于环境变量，可存在多份不同名称的.tfvars文件，运行时可以指定装载哪个
create_repo             # 内置脚本，用于在远程创建新项目，并自动克隆新项目到本地，同时复制example相应文件至新项目目录
metadata                # 元数据文件，json或yaml格式，该文件用于自动生成对应云模板，仓库提交后触发IaC创建相应模板
```
#### 开发并提交代码

1. 创建远程仓库，默认使用初始部署的Gitea，如果使用其他git仓库，此步骤无需执行，直接在目标git仓库上创建相应仓库即可
```shell
[/opt/example]# ./create_repo ${project_name}
git server: http://10.0.3.124:3000
username: 登录邮箱
password: 
repo ${project_name} create successed
git clone http://10.0.3.124:3000/iac/${project_name}.git
chdir ${project_name}
[/opt/${project_name}]# 
```

2. 代码开发并测试通过后，提交至代码仓库
```shell
# git add .
# git commit "feat: xxx"
# git push origin master
```
#### terraform & ansible 串连配置示例
terraform创建资源后，如需调用ansible进行应用部署，可参考如下配置资源实例与ansible角色之间的关联
```json
resource "ansible_host" "web" {
  count              = var.instance_number
  inventory_hostname = alicloud_instance.instance[count.index].public_ip
  groups             = ["web"]
  vars               = merge(local.common_vars,
    {
      port = 80
    }
  )
}
```
#### 创建、运行云模板
未配置metadata情况下，需手动创建并配置云模板
##### 创建云模板

   1. 登录IaC平台，选择所在组织，在云模板页面选择『创建云模板』
   1. 在『选择仓库』步骤选择相应的VCS（git仓库源，默认Gitea）
   1. 选择提交的代码仓库
   1. 输入云模板名称、描述、分支、是否保存状态、运行时默认的CT-Runner
   1. 保存提交即可

注：一个仓库可能覆盖多种场景，创建的云模板对应的场景建议在描述中加以说明，方便用户使用
##### 云模板参数配置及运行

   1. 云模板创建成功后，IaC平台会自动从仓库的**variables.tf **文件中提取变量名称、默认值、描述
   1. 进入『参数』配置页面，选择添加参数，在弹出的窗口中会列出所有提取的变量，勾选需要添加的变量并确认
   1. 填写变量对应的值并保存后即可运行云模板
   1. 在变量页面中可以选择是否加载tfvars文件，以及是否启用ansible进行应用部署，如启用的话可以选择运行哪个playbook文件

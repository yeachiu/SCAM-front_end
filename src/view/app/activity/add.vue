<template>
  <div>
    <Steps :current="current">
        <Step title="注册" icon="ios-person"></Step>
        <Step title="上传头像" icon="ios-camera"></Step>
        <Step title="验证邮箱" icon="ios-mail"></Step>
    </Steps>
    <Card :bordered="false" v-show = "current == 0">
      <p slot="title">表单一</p>
      <Form :model="formItem" :label-width="80">
        <FormItem label="Input1">
            <Input v-model="formItem.input" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="Select">
            <Select v-model="formItem.select1">
                <Option value="beijing">New York</Option>
                <Option value="shanghai">London</Option>
                <Option value="shenzhen">Sydney</Option>
            </Select>
        </FormItem>
        <FormItem label="DatePicker">
            <Row>
                <Col span="11">
                    <DatePicker type="date" placeholder="Select date" v-model="formItem.date1"></DatePicker>
                </Col>
                <Col span="2" style="text-align: center">-</Col>
                <Col span="11">
                    <TimePicker type="time" placeholder="Select time" v-model="formItem.time1"></TimePicker>
                </Col>
            </Row>
        </FormItem>
        <FormItem label="Radio">
            <RadioGroup v-model="formItem.radio1">
                <Radio label="male">Male</Radio>
                <Radio label="female">Female</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="Checkbox">
            <CheckboxGroup v-model="formItem.checkbox1">
                <Checkbox label="Eat"></Checkbox>
                <Checkbox label="Sleep"></Checkbox>
                <Checkbox label="Run"></Checkbox>
                <Checkbox label="Movie"></Checkbox>
            </CheckboxGroup>
        </FormItem>
        <FormItem label="Switch">
            <i-switch v-model="formItem.switch1" size="large">
                <span slot="open">On</span>
                <span slot="close">Off</span>
            </i-switch>
        </FormItem>
        <FormItem label="Slider">
            <Slider v-model="formItem.slider1" range></Slider>
        </FormItem>
        <FormItem label="Text">
            <Input v-model="formItem.textarea1" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
        </FormItem>
    </Form>
    </Card>
    <Card :bordered="false" v-show = "current == 1">
      <p slot="title">表单二</p>
      <Form :model="formItem" :label-width="80">
        <FormItem label="Input">
            <Input v-model="formItem.input" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="Select">
            <Select v-model="formItem.select">
                <Option value="beijing">New York</Option>
                <Option value="shanghai">London</Option>
                <Option value="shenzhen">Sydney</Option>
            </Select>
        </FormItem>
        <FormItem label="DatePicker">
            <Row>
                <Col span="11">
                    <DatePicker type="date" placeholder="Select date" v-model="formItem.date"></DatePicker>
                </Col>
                <Col span="2" style="text-align: center">-</Col>
                <Col span="11">
                    <TimePicker type="time" placeholder="Select time" v-model="formItem.time"></TimePicker>
                </Col>
            </Row>
        </FormItem>
        <FormItem label="Radio">
            <RadioGroup v-model="formItem.radio">
                <Radio label="male">Male</Radio>
                <Radio label="female">Female</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="Checkbox">
            <CheckboxGroup v-model="formItem.checkbox">
                <Checkbox label="Eat"></Checkbox>
                <Checkbox label="Sleep"></Checkbox>
                <Checkbox label="Run"></Checkbox>
                <Checkbox label="Movie"></Checkbox>
            </CheckboxGroup>
        </FormItem>
        <FormItem label="Switch">
            <i-switch v-model="formItem.switch" size="large">
                <span slot="open">On</span>
                <span slot="close">Off</span>
            </i-switch>
        </FormItem>
        <FormItem label="Slider">
            <Slider v-model="formItem.slider" range></Slider>
        </FormItem>
        <FormItem label="Text">
            <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem>
            <Button type="primary">Submit</Button>
            <Button style="margin-left: 8px">Cancel</Button>
        </FormItem>
      </Form>
    </Card>
    <div slot="footer">
      <Button type="primary" @click="prev">上一步</Button>
      <Button type="primary" @click="next">下一步</Button>
    </div>
  </div>
</template>
<script>
import { post } from '@/libs/axios-cfg'
export default {
  data () {
    return {
      current: 0,
      formItem: {
        input: '',
        select: '',
        radio: 'male',
        checkbox: [],
        switch: true,
        date: '',
        time: '',
        slider: [20, 50],
        textarea: '',
        input1: '',
        select1: '',
        radio1: 'male',
        checkbox1: [],
        switch1: true,
        date1: '',
        time1: '',
        slider1: [11, 50],
        textarea1: ''
      }
    }
  },
  methods: {
    next () {
      if (this.current == 3) {
        this.current = 0;
      } else {
        this.current += 1;
      }
    },
    prev () {
      if (this.current == 0) {
        this.current = 0;
      } else {
        this.current -= 1;
      }
    }    
  }
}
</script>
